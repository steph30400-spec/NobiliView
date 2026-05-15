import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#D4A84E]/5 blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7AE6D0] animate-pulse" />
            <span className="text-white/70 text-sm font-medium">Génération par IA — Gaussian Splat</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Transformez vos biens en<br />
            <span className="text-gradient-gold">visites 3D immersives</span>
          </h1>
          <p className="text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
            Importez vos photos, génèrez une visite interactive en quelques minutes.
            Vos clients visitent à 360° depuis n'importe quel navigateur — sans téléchargement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-gradient-to-r from-[#D4A84E] to-[#8CAEFF] text-[#050A10] font-bold text-base px-8 py-4 rounded-xl hover:opacity-90 transition-opacity glow-gold">
              Créer ma première visite — gratuit
            </Link>
            <Link href="/pricing" className="border border-white/20 text-white/80 font-medium text-base px-8 py-4 rounded-xl hover:bg-white/5 transition-colors">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Demo preview */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A1220]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4A84E]/5 to-transparent" />
            <div className="relative p-1">
              <div className="bg-[#050A10] rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4A84E]/20 to-[#7AE6D0]/20 flex items-center justify-center">
                    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                      <path d="M12 36L24 14L36 36" stroke="url(#hg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 36H36" stroke="url(#hg)" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="24" cy="14" r="4" fill="#D4A84E"/>
                      <defs>
                        <linearGradient id="hg" x1="12" y1="14" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#D4A84E"/>
                          <stop offset="1" stopColor="#7AE6D0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-white/40 text-base mb-2">Exemple de visite 3D générée</p>
                  <p className="text-white/25 text-sm">Tour interactif à 360° — navigation libre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Comment ça marche</h2>
            <p className="text-white/45 text-lg">Trois étapes pour une visite professionnelle</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Uploadez vos médias',
                desc: 'Sélectionnez jusqu\'à 8 photos par pièce + optionally une vidéo de 30s max. Formats acceptés : JPG, PNG, MP4, MOV.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#D4A84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )
              },
              {
                step: '02',
                title: 'Génération IA',
                desc: 'Notre engine IA crée un Gaussian Splat à partir de vos médias. Scan 3D photoréaliste en quelques minutes.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7l3-7z" stroke="#7AE6D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )
              },
              {
                step: '03',
                title: 'Partagez le lien',
                desc: 'Recevez un lien web unique. Vos clients visitent le bien en immersion totale — sur mobile, tablette ou desktop.',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#8CAEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#8CAEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )
              }
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="bg-[#0A1220] border border-white/8 rounded-xl p-7 hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[#D4A84E]/50 font-mono text-xs font-semibold">{step}</span>
                  {icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pour qui ?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Agences immobilières', desc: 'Offrez des visites virtuelles premium à vos mandants. Différenciez-vous avec une expérience immersive qui augmente le temps de présence sur vos annonces.' },
              { title: 'Mandataires & négociateurs', desc: 'Gagnez du temps en envoyant un lien de visite à vos prospects. Réduisez les visites inutiles et cadrez mieux vos RDV physique.' },
              { title: 'Promoteurs & marchands de biens', desc: 'Présentez vos programmes en cours de construction ou à venir. Vos clients visualisent le bien final avant même qu\'il existe.' },
              { title: 'Locations saisonnières', desc: 'Mettez en avant vos biens avec une visite interactive. Taux de conversion plus élevé sur vos annonces Airbnb / Booking.' }
            ].map(({ title, desc }) => (
              <div key={title} className="bg-[#0A1220] border border-white/8 rounded-xl p-7">
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à transformer vos annonces ?
          </h2>
          <p className="text-white/45 text-lg mb-10">
            Démarrez gratuitement. Pas de carte bancaire requise.
          </p>
          <Link href="/dashboard" className="inline-block bg-gradient-to-r from-[#D4A84E] to-[#8CAEFF] text-[#050A10] font-bold text-lg px-10 py-4 rounded-xl hover:opacity-90 transition-opacity glow-gold">
            Créer mon compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#D4A84E] to-[#7AE6D0] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M6 18L12 8L18 18M6 18H18" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span className="text-white font-semibold text-sm">NobiliView</span>
          </div>
          <p className="text-white/25 text-xs">© 2026 NobiliView. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-white/35 text-xs hover:text-white/60 transition-colors">Tarifs</Link>
            <Link href="/contact" className="text-white/35 text-xs hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}