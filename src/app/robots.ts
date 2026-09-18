import type { MetadataRoute } from 'next'

const BASE_URL = 'https://micdupinitiative.site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/studio', '/auth/', '/unauthorized'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
