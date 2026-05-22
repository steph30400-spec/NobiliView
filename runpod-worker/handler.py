import os
import shutil
import subprocess
import time
from pathlib import Path
from tempfile import TemporaryDirectory

import boto3
import runpod


def required_env(name):
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing env: {name}")
    return value


def safe_part(value):
    cleaned = "".join(char if char.isalnum() or char in "._-" else "-" for char in str(value or "asset"))
    while "--" in cleaned:
        cleaned = cleaned.replace("--", "-")
    return cleaned.strip("-")[:80] or "asset"


def r2_client():
    account_id = required_env("R2_ACCOUNT_ID")
    return boto3.client(
        "s3",
        endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
        region_name=os.environ.get("R2_REGION", "auto"),
        aws_access_key_id=required_env("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=required_env("R2_SECRET_ACCESS_KEY"),
    )


def run(command, cwd=None):
    started = time.time()
    print("+ " + " ".join(command), flush=True)
    env = os.environ.copy()
    env.setdefault("QT_QPA_PLATFORM", "offscreen")
    completed = subprocess.run(
        command,
        cwd=cwd,
        env=env,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    print(completed.stdout[-6000:], flush=True)
    if completed.returncode != 0:
        raise RuntimeError(f"Command failed with {completed.returncode}: {' '.join(command)}")
    return {"seconds": round(time.time() - started, 1)}


def download_sources(client, bucket, keys, directory):
    paths = []
    for index, key in enumerate(keys):
        suffix = Path(key).suffix or ".mp4"
        path = directory / f"source-{index:02d}{suffix}"
        client.download_file(bucket, key, str(path))
        paths.append(path)
    return paths


def build_input_video(source_paths, output_path):
    if len(source_paths) == 1:
        shutil.copyfile(source_paths[0], output_path)
        return {"combined": False}

    list_path = output_path.parent / "inputs.txt"
    list_path.write_text("".join(f"file '{path}'\n" for path in source_paths), encoding="utf-8")
    metrics = run([
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(list_path),
        "-vf",
        "scale=1920:-2",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        os.environ.get("RUNPOD_INPUT_CRF", "20"),
        "-an",
        "-movflags",
        "+faststart",
        str(output_path),
    ])
    return {"combined": True, "concat": metrics}


def create_preview(input_video, output_path):
    run([
        "ffmpeg",
        "-y",
        "-ss",
        os.environ.get("RUNPOD_PREVIEW_AT", "2"),
        "-i",
        str(input_video),
        "-frames:v",
        "1",
        "-vf",
        "scale=1280:-2",
        str(output_path),
    ])


def find_latest_config(outputs_dir):
    configs = sorted(outputs_dir.glob("**/config.yml"), key=lambda path: path.stat().st_mtime, reverse=True)
    if not configs:
        raise RuntimeError("Nerfstudio did not produce config.yml")
    return configs[0]


def find_exported_splat(export_dir):
    candidates = list(export_dir.glob("**/*.ply")) + list(export_dir.glob("**/*.splat")) + list(export_dir.glob("**/*.spz"))
    if not candidates:
        raise RuntimeError("Nerfstudio export did not produce a splat file")
    return max(candidates, key=lambda path: path.stat().st_size)


def upload_file(client, bucket, source_path, key, content_type):
    client.upload_file(
        str(source_path),
        bucket,
        key,
        ExtraArgs={"ContentType": content_type},
    )
    return key


def handler(job):
    payload = job.get("input") or {}
    project = payload.get("project") or {}
    bucket = payload.get("bucket") or required_env("R2_BUCKET_NAME")
    source_keys = project.get("sourceVideoKeys") or ([project.get("sourceVideoKey")] if project.get("sourceVideoKey") else [])
    source_keys = [key for key in source_keys if key]
    if not source_keys:
        raise RuntimeError("Project has no source video keys")

    slug = safe_part(project.get("slug") or project.get("projectId"))
    output_prefix = safe_part(payload.get("outputPrefix") or f"{slug}/runpod/{int(time.time())}")
    frame_target = int(payload.get("frameTarget") or os.environ.get("RUNPOD_FRAME_TARGET", "250"))
    max_iterations = int(payload.get("maxIterations") or os.environ.get("RUNPOD_MAX_ITERATIONS", "7000"))

    client = r2_client()
    metrics = {"engine": "nerfstudio-splatfacto", "sourceVideoCount": len(source_keys)}

    with TemporaryDirectory(prefix="nobiliview-runpod-") as workdir_raw:
        workdir = Path(workdir_raw)
        sources_dir = workdir / "sources"
        sources_dir.mkdir()
        source_paths = download_sources(client, bucket, source_keys, sources_dir)

        input_video = workdir / "input.mp4"
        metrics["input"] = build_input_video(source_paths, input_video)

        preview_path = workdir / "preview.jpg"
        create_preview(input_video, preview_path)

        data_dir = workdir / "data"
        outputs_dir = workdir / "outputs"
        export_dir = workdir / "export"

        metrics["processData"] = run([
            "ns-process-data",
            "video",
            "--data",
            str(input_video),
            "--output-dir",
            str(data_dir),
            "--num-frames-target",
            str(frame_target),
            "--no-gpu",
        ])

        metrics["train"] = run([
            "ns-train",
            "splatfacto",
            "--data",
            str(data_dir),
            "--output-dir",
            str(outputs_dir),
            "--max-num-iterations",
            str(max_iterations),
            "--viewer.quit-on-train-completion",
            "True",
        ])

        config_path = find_latest_config(outputs_dir)
        metrics["export"] = run([
            "ns-export",
            "gaussian-splat",
            "--load-config",
            str(config_path),
            "--output-dir",
            str(export_dir),
        ])

        splat_path = find_exported_splat(export_dir)
        splat_ext = splat_path.suffix.lower().lstrip(".") or "ply"
        splat_key = f"{output_prefix}/scene.{splat_ext}"
        preview_key = f"{output_prefix}/preview.jpg"

        upload_file(client, bucket, splat_path, splat_key, "application/octet-stream")
        upload_file(client, bucket, preview_path, preview_key, "image/jpeg")

        metrics["splatBytes"] = splat_path.stat().st_size

    return {
        "splatFileKey": splat_key,
        "previewImageKey": preview_key,
        "engine": "nerfstudio-splatfacto",
        "metrics": metrics,
        "artifactKeys": {
            "splat": splat_key,
            "preview": preview_key,
        },
    }


if __name__ == "__main__":
    runpod.serverless.start({"handler": handler})
