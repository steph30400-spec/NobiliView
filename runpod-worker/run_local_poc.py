import json
import os
import traceback
from pathlib import Path

from handler import handler


def load_env(path):
    env_path = Path(path)
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key, value)


def main():
    load_env("/workspace/r2.env")
    payload_path = Path(os.environ.get("NOBILIVIEW_RUNPOD_PAYLOAD", "/workspace/poc-payload.json"))
    payload = json.loads(payload_path.read_text(encoding="utf-8"))

    try:
        result = handler({"input": payload})
        Path("/workspace/poc-result.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
        Path("/workspace/poc.exit").write_text("0", encoding="utf-8")
        print(json.dumps(result, indent=2))
    except Exception:
        Path("/workspace/poc-error.txt").write_text(traceback.format_exc(), encoding="utf-8")
        Path("/workspace/poc.exit").write_text("1", encoding="utf-8")
        raise


if __name__ == "__main__":
    main()
