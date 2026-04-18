/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Enable React strict mode for better performance
    reactStrict: true,
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
  
  // Performance headers for static assets
  headers: async () => [
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  
  // Enable compression
  compress: true,
  
  // Optimize build output
  swcMinify: true,
  
  // Enable static optimization for marketing pages
  output: 'standalone',
}

module.exports = nextConfig