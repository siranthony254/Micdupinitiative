/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
  // Increase request body size limit for large blog content
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Exclude Studio from build temporarily
  excludeDefaultMomentLocales: false,
  experimental: {
    // Temporarily disable Studio during build
    serverComponentsExternalPackages: ['@sanity'],
  },
}

module.exports = nextConfig