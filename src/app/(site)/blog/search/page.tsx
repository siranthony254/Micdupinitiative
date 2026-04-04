"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { SanityPostWithRelations } from '@/types/blog'
import { urlFor } from '@/sanity/lib/image'

function BlogSearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<SanityPostWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    if (searchQuery) {
      performSearch()
    }
  }, [searchQuery])

  const performSearch = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
      const result = await response.json()
      
      if (!response.ok) {
        console.error('Error searching posts:', result.error)
      } else {
        setPosts(result.data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-b border-amber-700">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Search Blog
            </h1>
            <p className="text-xl text-amber-100 mb-8">
              Find articles, tutorials, and insights
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-3 bg-black/50 border border-amber-600 rounded-lg text-white placeholder-amber-200 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            {/* Search Results */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Enter a search term'}
              </h2>
              <p className="text-gray-400">
                {posts.length} {posts.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-6">
                  {searchQuery ? 'No articles found matching your search.' : 'Try searching for something specific.'}
                </p>
                <Link
                  href="/blog"
                  className="inline-block px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition"
                >
                  Browse All Articles
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map(post => (
                  <SearchResult key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SearchResult({ post }: { post: SanityPostWithRelations }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-amber-500 transition">
        <div className="md:flex">
          {post.mainImage && (
            <div className="md:w-1/3 relative h-48 md:h-auto">
              <Image
                src={urlFor(post.mainImage).width(400).height(300).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
          )}
          <div className="p-6 md:w-2/3">
            <div className="flex items-center gap-3 mb-3">
              {post.categories && post.categories.length > 0 && (
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  {post.categories[0].title}
                </span>
              )}
              <span className="text-gray-400 text-sm">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'No date'}
              </span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm">
                {post.readTime || 5} min read
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
                {post.author && (
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
      </div>
    </Link>
  )
}

export default function BlogSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-amber-500">Loading search...</div>
    </div>}>
      <BlogSearchPageContent />
    </Suspense>
  )
}
