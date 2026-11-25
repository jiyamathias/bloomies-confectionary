/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 public URLs — set R2_PUBLIC_URL in .env.local
      ...(process.env.R2_PUBLIC_URL
        ? (() => {
            try {
              const u = new URL(process.env.R2_PUBLIC_URL);
              return [{ protocol: u.protocol.replace(':', ''), hostname: u.hostname, pathname: '/**' }];
            } catch { return []; }
          })()
        : []),
      // Allow r2.dev sub-domains for local dev convenience
      { protocol: 'https', hostname: '*.r2.dev', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
