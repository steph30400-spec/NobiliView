import { S3Client } from '@aws-sdk/client-s3'

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing env: ${name}`)
  }
  return value
}

export function getR2BucketName() {
  return requiredEnv('R2_BUCKET_NAME')
}

export function getR2Client() {
  const accountId = requiredEnv('R2_ACCOUNT_ID')

  return new S3Client({
    region: process.env.R2_REGION ?? 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requiredEnv('R2_SECRET_ACCESS_KEY'),
    },
  })
}

export function getR2PublicUrl(key: string) {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL
  if (!baseUrl) return null

  return `${baseUrl.replace(/\/$/, '')}/${key}`
}
