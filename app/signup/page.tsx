'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, company }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error ?? 'Erreur lors de la creation du compte.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#050A10]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#7AE6D0]/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
              <path d="M5 13l4 4L19 7" stroke="#7AE6D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-white font-bold text-2xl mb-3">Compte créé !</h1>
          <p className="text-white/45 text-sm mb-8">
            Votre compte PostgreSQL a ete cree pour <span className="text-white font-medium">{email}</span>.
          </p>
          <Link href="/login" className="text-[#D4A84E] hover:text-[#D4A84E]/80 font-medium text-sm transition-colors">
            Se connecter
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#050A10]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A84E] to-[#7AE6D0] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M6 18L12 8L18 18M6 18H18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl">NobiliView</span>
          </Link>
        </div>

        <div className="bg-[#0A1220] border border-white/8 rounded-2xl p-8">
          <h1 className="text-white font-bold text-2xl mb-2">Créer un compte</h1>
          <p className="text-white/40 text-sm mb-8">Gratuit pour découvrir. Aucune carte bancaire requise.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full bg-[#050A10] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#D4A84E]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">Nom de l&apos;agence <span className="text-white/25">(optionnel)</span></label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Immobilier Dupont & Associés"
                className="w-full bg-[#050A10] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#D4A84E]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jean@agence.fr"
                required
                className="w-full bg-[#050A10] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#D4A84E]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                required
                minLength={8}
                className="w-full bg-[#050A10] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#D4A84E]/50 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4A84E] to-[#8CAEFF] text-[#050A10] font-bold text-sm py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Création en cours...' : 'Créer mon compte gratuit'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/35 text-sm mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-[#D4A84E] hover:text-[#D4A84E]/80 font-medium transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  )
}
