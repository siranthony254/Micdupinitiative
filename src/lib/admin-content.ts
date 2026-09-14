import 'server-only'
import { writeClient } from '@/sanity/lib/writeClient'

/**
 * Shared reads for /admin Server Components. All of these go through the
 * non-CDN write client (see src/sanity/lib/writeClient.ts) so an editor
 * sees their own just-saved changes immediately, instead of hitting the
 * public read client's CDN propagation delay.
 */

export async function getAdminPosts() {
  return writeClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, "slug": slug.current, publishedAt,
      "authorName": author->name
    }`
  )
}

export async function getAdminPost(id: string) {
  return writeClient.fetch(
    `*[_type == "post" && _id == $id][0]{
      _id, title, slug, publishedAt, mainImage, body,
      "authorId": author._ref,
      "categoryIds": categories[]._ref
    }`,
    { id }
  )
}

export async function getAdminUpdates() {
  return writeClient.fetch(
    `*[_type == "update"] | order(order asc, publishedAt desc) {
      _id, title, type, featured, showInRail, publishedAt
    }`
  )
}

export async function getAdminUpdate(id: string) {
  return writeClient.fetch(`*[_type == "update" && _id == $id][0]`, { id })
}

export async function getAdminCategories() {
  return writeClient.fetch(
    `*[_type == "category"] | order(title asc) {
      _id, title, "slug": slug.current, description
    }`
  )
}

export async function getAdminCategory(id: string) {
  return writeClient.fetch(`*[_type == "category" && _id == $id][0]`, { id })
}

export async function getAdminAuthors() {
  return writeClient.fetch(
    `*[_type == "author"] | order(name asc) {
      _id, name, "slug": slug.current, image
    }`
  )
}

export async function getAdminAuthor(id: string) {
  return writeClient.fetch(
    `*[_type == "author" && _id == $id][0]{
      _id, name, slug, image, bio
    }`,
    { id }
  )
}

export async function getAdminCounts() {
  const [posts, updates, categories, authors] = await Promise.all([
    writeClient.fetch<number>(`count(*[_type == "post"])`),
    writeClient.fetch<number>(`count(*[_type == "update"])`),
    writeClient.fetch<number>(`count(*[_type == "category"])`),
    writeClient.fetch<number>(`count(*[_type == "author"])`),
  ])
  return { posts, updates, categories, authors }
}
