'use client'

export default function ContactForm() {
  return (
    <form onSubmit={(e) => { e.preventDefault(); alert('Prototype : branchement n8n/email à ajouter.') }}>
      <input placeholder="Nom de l'agence" />
      <input placeholder="Email" type="email" />
      <input placeholder="Lien photos/vidéo du bien" />
      <button className="btn primary" type="submit">Demander une démo</button>
    </form>
  )
}
