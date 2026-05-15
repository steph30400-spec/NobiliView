import type { Metadata } from 'next'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/Toast'

export const metadata: Metadata = {
  title: 'NobiliView — Visites immobilières 3D premium',
  description: 'Générez des visites 3D immersives à partir de vos photos. Gaussian Splat powered by AI.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}