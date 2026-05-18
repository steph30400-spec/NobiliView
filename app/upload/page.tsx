'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState('')
  const [propertyId, setPropertyId] = useState('')

  async function handleFile(file: File) {
    setUploading(true)
    setError('')

    try {
      const presignRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          fileSize: file.size,
          propertyId: propertyId || undefined,
        }),
      })

      const presignData = await presignRes.json()

      if (!presignRes.ok) {
        setError(presignData.error ?? 'Erreur inconnue')
        return
      }

      const uploadRes = await fetch(presignData.uploadUrl, {
        method: presignData.method ?? 'PUT',
        headers: presignData.headers ?? { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      })

      if (!uploadRes.ok) {
        setError(`Erreur R2: ${uploadRes.status} ${uploadRes.statusText}`)
        return
      }

      setResults(prev => [
        ...prev,
        `${file.name} -> ${presignData.url ?? presignData.key}`,
      ])
    } catch (e) {
      setError('Erreur réseau: ' + String(e))
    } finally {
      setUploading(false)
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      await handleFile(file)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--dark)', color: 'var(--text)', padding: '0 40px' }}>
      {/* Nav */}
      <nav className="nav">
        <Link href="/" className="brand-logo">
          <img src="/logos/nobili-logo.svg.png" alt="NobiliView" height={60} style={{ height: 60, width: 'auto', objectFit: 'contain' }} />
        </Link>
        <nav>
          <Link href="/">Accueil</Link>
          <Link href="/pricing">Tarifs</Link>
        </nav>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: '60px auto', paddingBottom: 80 }}>
        <p className="eyebrow">Test upload</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 12 }}>Upload tes médias</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 40 }}>
          Envoie tes photos, vidéos ou fichiers splat. Les fichiers lourds sont stockés directement sur Cloudflare R2.
        </p>

        <label style={{ display: 'block', marginBottom: 20 }}>
          <span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 8 }}>
            ID du bien (optionnel)
          </span>
          <input
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            placeholder="villa-cannes"
            style={{
              width: '100%',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text)',
              padding: '14px 16px',
              fontSize: '1rem',
            }}
          />
        </label>

        {/* Drop zone */}
        <div style={{
          background: 'var(--card)',
          border: '2px dashed var(--border)',
          borderRadius: 16,
          padding: '48px 32px',
          textAlign: 'center',
          marginBottom: 24,
          transition: 'border-color 0.2s',
        }}>
          <input
            type="file"
            id="file-input"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/mov,.splat,.ply,.ksplat"
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📁</div>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: 8 }}>
              {uploading ? 'Upload en cours...' : 'Glisse tes fichiers ici ou clique pour sélectionner'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
              JPG, PNG, WebP, MP4, MOV, SPLAT, PLY — max 5 Go par fichier
            </p>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255,80,80,0.1)',
            border: '1px solid rgba(255,80,80,0.3)',
            borderRadius: 10,
            padding: '14px 20px',
            color: '#ff6060',
            fontSize: '0.9rem',
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* Results */}
        {results.map((r, i) => (
          <div key={i} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 18px',
            marginBottom: 8,
            fontSize: '0.85rem',
            wordBreak: 'break-all',
          }}>
            {r}
          </div>
        ))}

        {/* Info */}
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          marginTop: 32,
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 10 }}>Comment ça marche ?</h3>
          <ol style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 2, paddingLeft: 20 }}>
            <li>Upload tes photos ou ta vidéo ici</li>
            <li>Le navigateur envoie le fichier directement vers Cloudflare R2</li>
            <li>La clé du fichier est utilisée ensuite pour générer la visite 3D</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
