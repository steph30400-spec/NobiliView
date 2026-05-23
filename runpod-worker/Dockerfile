FROM ghcr.io/nerfstudio-project/nerfstudio:1.1.5

USER root

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    python3-pip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /worker

COPY requirements.txt /worker/requirements.txt
RUN python3 -m pip install --no-cache-dir -r /worker/requirements.txt \
  && python3 -c "import boto3, runpod, gsplat; print('runpod worker deps ok')"

ENV QT_QPA_PLATFORM=offscreen \
    RUNPOD_FRAME_TARGET=250 \
    RUNPOD_MAX_ITERATIONS=7000

COPY handler.py /worker/handler.py

ENTRYPOINT []
CMD ["python3", "-u", "/worker/handler.py"]
