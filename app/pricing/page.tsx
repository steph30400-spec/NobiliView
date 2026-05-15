import Navbar from '@/components/Navbar'
import Link from 'next/link'

const plans = [
  {
    name: 'Démo',
    price: 'Gratuit',
    period: '',
    desc: 'Pour découvrir NobiliView avec 1 bien.',
    credits: '1 bien',
    features: [
      '1 bien immobilier',
      'Jusqu\'à 5 pièces',
      'Lien de partage',
      'Validité 7 jours',
      'Support par email'
    ],
    cta: 'Commencer gratuitement',
    href: '/dashboard',
    highlight: false,
    tag: ''
  },
  {
    name: 'Starter',
    price: '49',
    period: '€/bien',
    desc: 'Pour les mandataires et négociateurs solos.',
    credits: '5 crédits',
    features: [
      '1 bien = 1 crédit',
      'Jusqu\'à 8 pièces par bien',
      'Vidéo supportée',
      'Hébergement 3 mois',
      'Lien de partage public',
      'Statistiques de visite',
      'Support prioritaire'
    ],
    cta: 'Commander des crédits',
    href: '/dashboard',
    highlight: true,
    tag: 'Populaire'
  },
  {
    name: 'Agence',
    price: '79',
    period: '€/mois',
    desc: 'Pour les agences qui génèrent régulièrement.',
    credits: '10 crédits/mois',
    features: [
      '10 biens/mois',
      'Jusqu\'à 15 pièces par bien',
      'Vidéo supportée',
      'Hébergement 12 mois',
      'Liens personnalisables',
      'Dashboard équipe',
      'Accès multi-utilisateurs',
      'Support dédié'
    ],
    cta: 'Contacter les ventes',
    href: '/contact',
    highlight: false,
    tag: ''
  }
]

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
              Tarifs simples et transparents
            </h1>
            <p className="text-white/45 text-xl max-w-2xl mx-auto">
              Pas d'abonnement lock-in. Vous achetez des crédits selon vos besoins.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-8 flex flex-col ${plan.highlight ? 'bg-[#0D1829] border-2 border-[#D4A84E]/40' : 'bg-[#0A1220] border border-white/8'}`}>
                {plan.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#D4A84E] to-[#8CAEFF] text-[#050A10] font-bold text-xs px-4 py-1 rounded-full">
                      {plan.tag}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-sm mb-1">{plan.period}</span>
                  </div>
                  <p className="text-white/45 text-sm">{plan.desc}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <span className="text-[#7AE6D0] font-semibold text-sm">{plan.credits}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/65">
                      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 mt-0.5 shrink-0">
                        <path d="M4 10l4 4 8-8" stroke="#7AE6D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center font-bold text-sm py-3.5 rounded-xl transition-opacity ${plan.highlight ? 'bg-gradient-to-r from-[#D4A84E] to-[#8CAEFF] text-[#050A10] hover:opacity-85' : 'border border-white/20 text-white/80 hover:bg-white/5'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center bg-[#0A1220] rounded-xl p-8 border border-white/8">
            <h3 className="text-white font-bold text-lg mb-2">Hébergement prolongé</h3>
            <p className="text-white/45 text-sm mb-6">Au-delà des durées incluses, vos tours restent accessibles.</p>
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <p className="text-2xl font-black text-white">+9€</p>
                <p className="text-white/35 text-xs mt-1">/mois /bien</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">+49€</p>
                <p className="text-white/35 text-xs mt-1">/an /bien</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}