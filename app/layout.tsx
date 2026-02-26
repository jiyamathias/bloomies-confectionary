import type { Metadata } from 'next'
import './globals.css'

const SITE_URL  = 'https://bloomies.ng'
const SITE_NAME = 'Bloomies Confectioneries'
const SITE_DESC =
  'Premium cakes, pastries, small chops & irresistible treats crafted fresh ' +
  'daily in Port Harcourt, Nigeria. Order via WhatsApp, Glovo or Chowdeck. ' +
  '5-star Google rated.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  `${SITE_NAME} — Premium Cakes & Pastries | Port Harcourt`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    'cakes Port Harcourt', 'pastries Port Harcourt', 'bakery Port Harcourt',
    'custom cakes Nigeria', 'small chops PH', 'birthday cakes Port Harcourt',
    'banana bread Port Harcourt', 'Bloomies Confectioneries',
    'order cake WhatsApp', 'Glovo pastries', 'Chowdeck bakery',
    'Mgbuoba bakery', 'Rivers State bakery',
  ],
  authors:   [{ name: SITE_NAME, url: SITE_URL }],
  creator:   SITE_NAME,
  publisher: SITE_NAME,
  category:  'food & bakery',
  openGraph: {
    type:        'website',
    locale:      'en_NG',
    url:          SITE_URL,
    siteName:     SITE_NAME,
    title:       `${SITE_NAME} — Premium Cakes & Pastries | Port Harcourt`,
    description:  SITE_DESC,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Bloomies Confectioneries' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       `${SITE_NAME} — Premium Cakes & Pastries | Port Harcourt`,
    description:  SITE_DESC,
    images:      [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Bakery',
  name:        SITE_NAME,
  description: SITE_DESC,
  url:         SITE_URL,
  telephone:  '+2348181154270',
  image:      `${SITE_URL}/og-image.jpg`,
  address: {
    '@type':         'PostalAddress',
    streetAddress:   'No 33 Amadimati Street',
    addressLocality: 'Mgbuoba',
    addressRegion:   'Rivers State',
    postalCode:      '500272',
    addressCountry:  'NG',
  },
  geo: { '@type': 'GeoCoordinates', latitude: '4.8396', longitude: '7.0122' },
  openingHoursSpecification: {
    '@type':    'OpeningHoursSpecification',
    dayOfWeek:  ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens:      '08:00',
    closes:     '17:00',
  },
  priceRange:   '₦1,000 – ₦10,000',
  servesCuisine: ['Cakes','Pastries','Small Chops','Bread','Nigerian Confectionery'],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0', reviewCount: '12', bestRating: '5', worstRating: '1',
  },
  sameAs: ['https://instagram.com/bloomies.ng'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
