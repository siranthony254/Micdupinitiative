"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import type { BlogPost, BlogCategory, BlogTag } from '@/types/blog'

export default function BlogPage() {
  const { user, profile, isAdmin } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    fetchFeaturedPosts()
  }, [searchTerm, selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(id, name, avatar_url),
          category:blog_categories(id, name, slug),
          tags:blog_post_tags(
            blog_tags(id, name, slug)
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      // Apply filters
      if (searchTerm) {
        query = query.textSearch('search', searchTerm)
      }
      
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      const { data, error } = await query
      
      if (!error && data) {
        setPosts(data as BlogPost[])
        
        // Track views for displayed posts
        data.forEach(post => {
          incrementPostViews(post.slug)
        })
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (!error && data) {
        setCategories(data as BlogCategory[])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_profiles(id, full_name, avatar_url, role),
          category:blog_categories(id, name, slug)
        `)
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (!error && data) {
        setFeaturedPosts(data as BlogPost[])
      }
    } catch (error) {
      console.error('Error fetching featured posts:', error)
    }
  }

  const incrementPostViews = async (slug: string) => {
    try {
      await supabase.rpc('increment_blog_post_views', { post_slug: slug })
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover the latest insights, tutorials, and stories from our community
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map(post => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                      {post.featured_image && (
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-amber-500 text-black text-xs px-2 py-1 rounded">Featured</span>
                          {post.category && (
                            <span className="text-gray-400 text-sm">{post.category.name}</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {post.excerpt || truncateText(post.content, 100)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{formatDate(post.created_at)}</span>
                          <span>{post.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No posts found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                      {post.featured_image && (
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <span className="text-gray-400 text-sm">{post.category.name}</span>
                          )}
                          {post.featured && (
                            <span className="bg-amber-500 text-black text-xs px-2 py-1 rounded">Featured</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {post.excerpt || truncateText(post.content, 100)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{formatDate(post.created_at)}</span>
                          <span>{post.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
