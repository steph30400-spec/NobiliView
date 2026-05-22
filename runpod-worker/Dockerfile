FROM runpod/pytorch:2.4.0-py3.11-cuda12.4.1-devel-ubuntu22.04

USER root

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    colmap \
    ffmpeg \
    git \
    python3-pip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /worker

COPY requirements.txt /worker/requirements.txt
RUN python3 -m pip install --upgrade pip \
  && python3 -m pip install --no-cache-dir --ignore-installed blinker -r /worker/requirements.txt

ENV QT_QPA_PLATFORM=offscreen \
    RUNPOD_FRAME_TARGET=250 \
    RUNPOD_MAX_ITERATIONS=7000

COPY handler.py /worker/handler.py

CMD ["python3", "-u", "/worker/handler.py"]
