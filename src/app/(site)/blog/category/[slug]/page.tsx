import type { Metadata } from 'next'
import { getBlogCategory } from '@/lib/blog'
import BlogCategoryView from './BlogCategoryView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: category } = await getBlogCategory(slug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  const description =
    category.description || `Posts from Mic’d Up Initiative filed under ${category.title}.`

  return {
    title: `${category.title} | Blog`,
    description,
    openGraph: { title: `${category.title} | Blog`, description },
  }
}

export default function BlogCategoryPage() {
  return <BlogCategoryView />
}
