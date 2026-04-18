"use client"

import { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'
import type { SanityPostWithRelations, SanityCategory } from '@/types/blog'
import { urlFor } from '@/sanity/lib/image'
import { getOptimizedImageProps, debounce } from '@/lib/performance'
import { getBlogPosts, getBlogCategories, getFeaturedPosts } from '@/lib/blog'

export default function BlogPage() {
  const { user, profile, isAdmin } = useAuth()
  const [posts, setPosts] = useState<SanityPostWithRelations[]>([])
  const [categories, setCategories] = useState<SanityCategory[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<SanityPostWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Debounced search function
  const debouncedSearch = debounce(async (term: string) => {
    if (term.trim()) {
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''
      const { data, error } = await getBlogPosts({
        limit: 12,
        search: term.trim(),
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      })

      if (error) {
        console.error('Error searching posts:', error)
        return
      }

      setPosts(data || [])
    }
  }, 300) // 300ms debounce

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    fetchFeaturedPosts()
  }, [debouncedSearch, selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await getBlogPosts({
        limit: 12,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      })

      if (error) {
        console.error('Error fetching posts:', error)
        return
      }

      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await getBlogCategories()

      if (error) {
        console.error('Error fetching categories:', error)
        return
      }

      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      const { data, error } = await getFeaturedPosts(3)

      if (error) {
        console.error('Error fetching featured posts:', error)
        return
      }

      setFeaturedPosts(data || [])
    } catch (error) {
      console.error('Error fetching featured posts:', error)
    }
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const term = (e.target as HTMLInputElement).value
    setSearchTerm(term)
    debouncedSearch(term)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              MUI Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Insights, tutorials, and stories from the MUI community
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-r-lg font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.slug.current)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.slug.current
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article key={post._id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-amber-500 transition-shadow">
                  {post.mainImage && (
                    <div className="h-48 overflow-hidden">
                      <Image
                        {...getOptimizedImageProps(
                          urlFor(post.mainImage).width(400).height(200).url(),
                          400,
                          200
                        )}
                        alt={post.mainImage.alt || post.title}
                        fill
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/blog/${post.slug.current}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      {post.author && (
                        <span>By {post.author.name}</span>
                      )}
                      {post.publishedAt && (
                        <span className="ml-4">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">
            {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(c => c.slug.current === selectedCategory)?.title} Articles`}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post._id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-amber-500 transition-shadow">
                  {post.mainImage && (
                    <div className="h-48 overflow-hidden">
                      <Image
                        {...getOptimizedImageProps(
                          urlFor(post.mainImage).width(400).height(200).url(),
                          400,
                          200
                        )}
                        alt={post.mainImage.alt || post.title}
                        fill
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/blog/${post.slug.current}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {post.author && (
                          <span>By {post.author.name}</span>
                        )}
                        {post.publishedAt && (
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {post.readTime && (
                        <span>{post.readTime} min read</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
