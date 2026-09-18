import type { Metadata } from 'next'
import { getBlogPost } from '@/lib/blog'
import { urlFor } from '@/sanity/lib/image'
import BlogPostView from './BlogPostView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await getBlogPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const description: string =
    post.excerpt || 'A story from Mic’d Up Initiative.'
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: post.mainImage?.alt || post.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default function BlogPostPage() {
  return <BlogPostView />
}
