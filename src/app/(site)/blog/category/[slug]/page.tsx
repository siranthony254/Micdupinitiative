"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts, getBlogCategories } from '@/lib/blog'
import { useAuth } from '@/contexts/auth-context'
import type { BlogPostWithRelations, BlogCategory } from '@/types/blog'

export default function BlogCategoryPage() {
  const { slug } = useParams()
  const { profile, isAdmin } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPostWithRelations[]>([])
  const [category, setCategory] = useState<BlogCategory | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user has blog admin permissions
  const isBlogAdmin = isAdmin

  useEffect(() => {
    if (slug) {
      fetchCategory()
    }
  }, [slug])

  useEffect(() => {
    if (category) {
      fetchPosts()
    }
  }, [category?.id])

  const fetchCategory = async () => {
    try {
      const result = await getBlogCategories()
      const found = result.data?.find((cat: BlogCategory) => cat.slug === slug)
      setCategory(found || null)
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const { data, error } = await getBlogPosts({
        status: 'published',
        category_id: category?.id
      })
      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Category Not Found</h1>
          <p className="text-gray-400 mb-6">The category you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-amber-400 hover:text-amber-300 underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-b border-amber-700">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <Link href="/blog" className="text-amber-200 hover:text-amber-100 underline mb-4 inline-block">
              ← Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-amber-100 mb-8">
                {category.description}
              </p>
            )}
            <p className="text-gray-300">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-6">
              No articles published in this category yet.
            </p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              Browse All Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Admin Link */}
        {isBlogAdmin && (
          <div className="mt-12 text-center">
            <Link
              href="/mui-portal/admin/blog"
              className="inline-block px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              Manage Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: BlogPostWithRelations }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-amber-500 transition cursor-pointer">
        {post.featured_image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
            {post.featured && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-amber-500 text-black text-xs font-semibold rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-400 text-sm">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-400 text-sm">
              {post.read_time} min read
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-400 line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.author?.name && (
                <span className="text-gray-400 text-sm">
                  By {post.author.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
