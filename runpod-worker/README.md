# NobiliView RunPod GPU Worker

Worker POC pour remplacer World Labs par un moteur Gaussian Splat maison.

## Ce que fait le worker

1. Reçoit le payload NobiliView depuis scripts/runpod-processor.mjs.
2. Télécharge les vidéos source depuis Cloudflare R2.
3. Concatène les vidéos si besoin.
4. Reconstruit les caméras avec COLMAP via Nerfstudio.
5. Lance l'entraînement Splatfacto sur GPU.
6. Exporte un fichier .ply Gaussian Splat.
7. Upload le .ply et une preview .jpg vers R2.
8. Retourne splatFileKey et previewImageKey au worker NobiliView existant.

Le viewer NobiliView utilise @sparkjsdev/spark, qui supporte .ply, .spz, .splat, .ksplat et .sog.

## Variables RunPod requises

Configurer ces variables dans l'endpoint RunPod, pas dans le payload :

```bash
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_REGION=auto
RUNPOD_FRAME_TARGET=250
RUNPOD_MAX_ITERATIONS=7000
```

## Variables NobiliView requises

Dans .env.local côté app/worker :

```bash
RUNPOD_API_KEY=...
RUNPOD_ENDPOINT_ID=...
PROCESSOR_COMMAND=node scripts/runpod-processor.mjs
RUNPOD_TIMEOUT_MS=21600000
RUNPOD_POLL_INTERVAL_MS=30000
```

## Build image

```bash
cd runpod-worker
docker build -t nobiliview-runpod-worker:latest .
```

Pousser ensuite l'image vers un registry accessible par RunPod, puis créer un endpoint Serverless GPU.

## Réglages POC recommandés

- GPU : RTX 4090, A40, A5000 ou H100 selon disponibilité.
- RUNPOD_FRAME_TARGET=120 pour le test rapide, soit environ 4 fps sur une vidéo de 30 secondes.
- RUNPOD_FRAME_TARGET=250-500 pour un test qualité.
- RUNPOD_MAX_ITERATIONS=1000 pour valider le pipeline.
- RUNPOD_MAX_ITERATIONS=7000-15000 pour un rendu réellement exploitable.
- COLMAP tourne en mode CPU/headless (--no-gpu) pour éviter les erreurs OpenGL/X11 des pods sans bureau graphique.
- Le GPU reste utilisé par Splatfacto, c'est la partie coûteuse et utile pour la qualité.

## Commande NobiliView

Une fois l'endpoint prêt :

```bash
PROCESSOR_COMMAND="node scripts/runpod-processor.mjs" npm run worker:process -- --limit 1
```
