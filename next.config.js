/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Optimize bundle splitting
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    // Enable image optimization
    minimumCacheTTL: 60 * 60 * 24, // 1 day
    dangerouslyAllowSVG: true,
  },
  
  // Increase request body size limit for large blog content
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  
  // Exclude Studio from build temporarily
  excludeDefaultMomentLocales: false,
  serverExternalPackages: [],
  
  // Performance and security headers
  headers: async () => [
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Applies site-wide. Kept conservative (no Content-Security-Policy)
      // since this app embeds Sanity Studio, YouTube, Google Fonts, and
      // posts to Formspree/Supabase/Sanity - a strict CSP needs to be
      // built and tested against all of those before it's safe to ship.
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
  
  // Enable compression
  compress: true,
  
  // Enable static optimization for marketing pages
  output: 'standalone',
}

module.exports = nextConfig
