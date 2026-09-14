import { revalidatePath } from 'next/cache'
import { buildPathsForDocument } from '@/sanity/plugins/deleteFromWebsite/config'

/**
 * Reuses the same routeMap the Studio "delete from website" webhook already
 * relies on (src/sanity/plugins/deleteFromWebsite/config.ts), so admin
 * writes invalidate the cache the same way Studio deletes already do, plus
 * whichever list/index pages a given entity type also needs refreshed.
 */
export function revalidateForDocument(type: string, doc: any, extraPaths: string[] = []) {
  const paths = [...buildPathsForDocument(type, doc), ...extraPaths]
  for (const path of paths) {
    try {
      revalidatePath(path)
    } catch (err) {
      console.warn('Revalidate failed for', path, err)
    }
  }
}
