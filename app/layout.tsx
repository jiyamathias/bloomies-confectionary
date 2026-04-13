import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientShell from '@/components/ClientShell'

export const metadata: Metadata = {
  title: 'Bloomies Confectioneries — When Quality Matters',
  description:
    'Premium cakes, pastries, small chops & irresistible treats made fresh daily in Port Harcourt. Order online or via WhatsApp.',
  keywords: 'cakes, pastries, small chops, banana bread, Port Harcourt, custom cakes, Bloomies',
  openGraph: {
    title: 'Bloomies Confectioneries',
    description: 'Premium cakes, pastries & confections crafted with love in Port Harcourt.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAFAFE',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFE] antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
