// Map Sanity document types to site route builders
export const routeMap: Record<string, (doc: any) => string[]> = {
  post: (doc) => {
    const slug = doc?.slug?.current || doc?.slug
    return slug ? [`/blog/${slug}`] : []
  },
  video: (doc) => {
    const slug = doc?.slug?.current || doc?._id || doc?.slug
    return slug ? [`/videos/${slug}`] : []
  },
  update: (doc) => {
    const slug = doc?.slug?.current || doc?.slug
    return slug ? [`/updates/${slug}`] : []
  },
  // Default catch-all that attempts to map `slug` to top-level path
  default: (doc) => {
    const slug = doc?.slug?.current || doc?.slug || doc?._id
    return slug ? [`/${slug}`] : []
  },
}

export function buildPathsForDocument(type: string, doc: any) {
  const fn = routeMap[type] || routeMap.default
  try {
    return fn(doc) || []
  } catch (err) {
    console.warn('Error building paths for', type, err)
    return []
  }
}
