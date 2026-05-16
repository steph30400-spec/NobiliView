'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#050A10]">
      <div className="w-full max-w-md">
        {/* Logo */}
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

        {/* Card */}
        <div className="bg-[#0A1220] border border-white/8 rounded-2xl p-8">
          <h1 className="text-white font-bold text-2xl mb-2">Connexion</h1>
          <p className="text-white/40 text-sm mb-8">Accédez à votre tableau de bord</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
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
                placeholder="••••••••"
                required
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
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/reset-password" className="text-white/35 text-sm hover:text-white/60 transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-white/35 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-[#D4A84E] hover:text-[#D4A84E]/80 font-medium transition-colors">
            Créer un compte gratuit
          </Link>
        </p>
      </div>
    </main>
  )
}