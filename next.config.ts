import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    /**
     * Local images in /public/images/ are handled automatically.
     * The remotePatterns below is ONLY needed during development if you
     * still have any Unsplash URLs. Once you've saved all photos locally,
     * this section can be removed entirely.
     *
     * NOTE: unoptimized is NOT set here — Next.js Image optimisation is
     * fully enabled, giving you WebP/AVIF conversion and responsive srcset.
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
