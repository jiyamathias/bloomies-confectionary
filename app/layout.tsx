import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ClientShell from '@/components/ClientShell'

// Brand display font (same as the logo on Canva)
// Self-hosted so builds don't depend on reaching Google Fonts.
const luckiest = localFont({
  src: './fonts/LuckiestGuy-Regular.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-luckiest',
})

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
    <html lang="en" className={luckiest.variable}>
      <body className="bg-[#FAFAFE] antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
