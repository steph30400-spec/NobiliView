import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'
import { getR2BucketName, getR2Client, getR2PublicUrl } from '@/lib/r2'

export const runtime = 'nodejs'

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 * 1024

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/mov',
  'application/octet-stream',
  'model/vnd.ply',
])

function safeFileName(name: string) {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return cleaned || 'upload.bin'
}

function getExtension(name: string) {
  const match = safeFileName(name).match(/\.([a-zA-Z0-9]+)$/)
  return match?.[1]?.toLowerCase() ?? 'bin'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const fileName = typeof body.fileName === 'string' ? body.fileName : ''
    const fileType = typeof body.fileType === 'string' ? body.fileType : 'application/octet-stream'
    const fileSize = Number(body.fileSize)
    const propertyId = typeof body.propertyId === 'string' && body.propertyId.trim()
      ? safeFileName(body.propertyId)
      : 'uploads'

    if (!fileName) {
      return NextResponse.json({ error: 'Nom de fichier manquant' }, { status: 400 })
    }

    if (!Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json({ error: 'Taille de fichier invalide' }, { status: 400 })
    }

    if (fileSize > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Go)' }, { status: 413 })
    }

    const ext = getExtension(fileName)
    const normalizedType = fileType || 'application/octet-stream'
    const isSplatLike = ['splat', 'ply', 'ksplat'].includes(ext)

    if (!ALLOWED_TYPES.has(normalizedType) && !isSplatLike) {
      return NextResponse.json({ error: 'Type de fichier non supporte' }, { status: 400 })
    }

    const key = `${propertyId}/${Date.now()}-${crypto.randomUUID()}-${safeFileName(fileName)}`
    const contentType = isSplatLike ? 'application/octet-stream' : normalizedType

    const command = new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
    })

    const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 15 * 60 })

    return NextResponse.json({
      uploadUrl,
      key,
      url: getR2PublicUrl(key),
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
    })
  } catch (e) {
    console.error('[R2 upload-url] Error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Erreur interne: ' + message }, { status: 500 })
  }
}
