'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link href="/" className="brand-logo">
        <img src="/logos/nobili-logo.svg.png" alt="NobiliView" height={60} style={{ height: 60, width: 'auto', objectFit: 'contain' }} />
      </Link>
      <nav>
        <a href="#demo">Démo</a>
        <a href="#pricing">Tarifs</a>
        <a href="#contact">Essai gratuit</a>
      </nav>
    </nav>
  )
}
