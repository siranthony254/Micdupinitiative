import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Write-capable Sanity client for the /admin panel. Server-only: the token
 * is read from a non-NEXT_PUBLIC_ env var, so Next.js never inlines it into
 * a client bundle, and the `server-only` import makes any accidental import
 * from a "use client" file a build error rather than a silent leak.
 *
 * useCdn is false so admin reads (see src/lib/admin-content.ts) never see
 * stale, CDN-cached data right after a write.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
