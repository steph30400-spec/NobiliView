'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#050A10]/80 border-b border-white/8">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A84E] to-[#7AE6D0] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M6 18L12 8L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">NobiliView</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/#features" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Fonctionnalités</Link>
          <Link href="/pricing" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Tarifs</Link>
          <Link href="/dashboard" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Connexion</Link>
          <Link href="/dashboard" className="bg-gradient-to-r from-[#D4A84E] to-[#8CAEFF] text-[#050A10] font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Commencer
          </Link>
        </div>
      </div>
    </nav>
  )
}