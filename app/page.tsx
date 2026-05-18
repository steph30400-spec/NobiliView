import Navbar from '@/components/Navbar'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Pour agences immobilières & mandataires</p>
          <h1>Transformez vos photos ou vidéos en visite 3D immersive.</h1>
          <p className="lead">Recevez un lien web partageable avec vos acheteurs. Aucun Matterport, aucun scan 360 obligatoire : vos photos suffisent pour générer une scène 3D navigable par IA.</p>
          <div className="actions">
            <Link href="/signup" className="btn primary">Tester avec un bien</Link>
            <Link href="#demo" className="btn secondary">Voir la démo</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="viewer-mock">
            <span className="badge">Démo 3D</span>
            <div className="room-grid"></div>
          </div>
          <p>Salon, cuisine, chambre, terrasse : chaque pièce devient une expérience web immersive.</p>
        </div>
      </section>

      {/* Proof / Demo */}
      <section className="proof" id="demo">
        <div>
          <p className="eyebrow">Démo générée depuis de vraies photos</p>
          <h2>Un appartement réel, reconstruit en 3D</h2>
          <p>Cette démo a été générée avec World Labs Marble depuis 7 photos classiques d&apos;un appartement.</p>
        </div>
        <a className="btn primary" target="_blank" rel="noreferrer" href="https://marble.worldlabs.ai/world/c3865f3b-9483-47dc-aac9-3649e47e089e">Ouvrir la démo Marble</a>
      </section>

      {/* Use cases */}
      <section className="usecases" id="usecases">
        <h2>Pour qui ?</h2>
        <div className="usecases-grid">
          {[
            { icon: '🏠', title: 'Agences immobilières', desc: 'Offrez des visites virtuelles premium à vos mandants. Différenciez-vous avec une expérience immersive qui augmente le temps de présence sur vos annonces.' },
            { icon: '🗝️', title: 'Mandataires & négociateurs', desc: 'Gagnez du temps en envoyant un lien de visite à vos prospects. Réduisez les visites inutiles et cadrez mieux vos RDV physique.' },
            { icon: '🏡', title: 'Locations saisonnières', desc: 'Airbnb, VRBO, Booking — Mettez en avant vos biens avec une visite interactive. Taux de conversion plus élevé sur vos annonces.' },
            { icon: '🎪', title: 'Salles & événements', desc: 'Montrez vos espaces de réception, salles de mariage ou bureaux en immersion totale. Vos clients visualisent le lieu avant de signer.' },
            { icon: '🏗️', title: 'Promoteurs & marchands de biens', desc: 'Présentez vos programmes en cours de construction ou à venir. Vos clients visualisent le bien final avant même qu\'il existe.' },
            { icon: '🌊', title: 'Immobilier de bord de mer', desc: 'Villas avec piscine, beach homes, marina — le Gaussian Splat excelle pour capturer les extérieurs et les vues.' },
          ].map(({ icon, title, desc }) => (
            <article key={title}>
              <div className="uc-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="steps">
        <h2>Comment ça marche</h2>
        <div className="cards">
          {[
            { n: '1', title: 'Vous envoyez vos médias', desc: '8 photos max par pièce ou une vidéo lente de 30 secondes.' },
            { n: '2', title: 'On génère la visite', desc: 'L\'IA reconstruit une scène Gaussian Splat navigable dans le navigateur.' },
            { n: '3', title: 'Vous recevez un lien', desc: 'Un lien privé à intégrer dans vos annonces, emails ou site agence.' },
          ].map(({ n, title, desc }) => (
            <article key={n}>
              <strong>{n}</strong>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <h2>Tarifs transparents</h2>
        <p className="pricing-intro">Un crédit = une génération complète, peu importe le nombre de photos.</p>

        <div className="comparison-table">
          <div className="comparison-header">
            <div className="comp-col empty"></div>
            <div className="comp-col">
              <h3>Démo</h3>
              <p className="comp-price">49€</p>
              <p className="comp-desc">Paiement unique</p>
            </div>
            <div className="comp-col featured">
              <span className="comp-badge">Le + populaire</span>
              <h3>Standard</h3>
              <p className="comp-price">129€</p>
              <p className="comp-desc">Paiement unique</p>
            </div>
            <div className="comp-col">
              <h3>Agence</h3>
              <p className="comp-price">79€<span className="per-month">/mois</span></p>
              <p className="comp-desc">Abonnement mensuel</p>
            </div>
          </div>

          {[
            { label: 'Crédits utilisés', values: ['1 crédit', '1 crédit', '10 crédits / mois'] },
            { label: 'Pièces max par bien', values: ['3 pièces', '3 pièces', '15 pièces'] },
            { label: 'Lien de partage', values: ['✅', '✅', '✅'] },
            { label: 'Mini-page web avec navigation', values: ['❌', '✅', '✅'] },
            { label: 'Hébergement', values: ['30 jours', '60 jours', '12 mois'] },
            { label: 'Dashboard utilisateur', values: ['❌', '✅', '✅'] },
            { label: 'Accès multi-utilisateurs', values: ['❌', '❌', '✅'] },
            { label: 'Template personnalisable', values: ['❌', '❌', '✅'] },
            { label: 'Support', values: ['Email', 'Prioritaire', 'Dédié'] },
          ].map(({ label, values }) => (
            <div key={label} className="comp-row">
              <div className="comp-label">{label}</div>
              {values.map((v, i) => (
                <div key={i} className={`comp-cell ${v === '✅' ? 'check' : v === '❌' ? 'cross' : ''}`}>{v}</div>
              ))}
            </div>
          ))}

          <div className="comp-cta">
            <div className="comp-label"></div>
            <div className="comp-cell"><Link href="#contact" className="btn-outline">Choisir Démo</Link></div>
            <div className="comp-cell"><Link href="#contact" className="btn-primary">Choisir Standard</Link></div>
            <div className="comp-cell"><Link href="#contact" className="btn-outline">Choisir Agence</Link></div>
          </div>
        </div>

        <div className="hosting-note">
          <strong>Hébergement prolongé :</strong> +9€/mois par bien ou +49€/an. Réservé aux packs Démo et Standard.
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="contact" id="contact">
        <div>
          <p className="eyebrow">Offre test</p>
          <h2>Envoyez un bien, recevez une visite 3D.</h2>
          <p>Prototype : le formulaire peut envoyer vers email, Telegram ou n8n. Pas besoin de base de données pour tester le marché.</p>
        </div>
        <ContactForm />
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="brand-logo">
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
              <rect width="40" height="40" rx="10" fill="url(#fg)"/>
              <path d="M10 28L20 12L30 28M10 28H30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D4A84E"/>
                  <stop offset="1" stopColor="#7AE6D0"/>
                </linearGradient>
              </defs>
            </svg>
            <span>NobiliView</span>
          </div>
          <p className="copyright">© 2026 NobiliView. Tous droits réservés.</p>
          <div className="footer-links">
            <Link href="/pricing">Tarifs</Link>
            <Link href="#contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}