"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPost, getBlogComments, createBlogComment, incrementPostViews, incrementPostShares } from '@/lib/blog'
import { useAuth } from '@/contexts/auth-context'
import type { BlogPostWithRelations, BlogComment } from '@/types/blog'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { user, profile, isAdmin } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState<BlogPostWithRelations | null>(null)
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [shareLoading, setShareLoading] = useState<{ [key: string]: boolean }>({})

  // Check if user has blog admin permissions
  const isBlogAdmin = isAdmin || profile?.blog_role === 'admin' || profile?.blog_role === 'editor'

  useEffect(() => {
    if (slug) {
      fetchPost()
      fetchComments()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const { data, error } = await getBlogPost(slug as string)
      
      if (error) {
        console.error('Error fetching post:', error)
        router.push('/blog')
        return
      }

      if (data) {
        setPost(data)
        // Increment view count
        await incrementPostViews(slug as string)
      }
    } catch (error) {
      console.error('Error:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await getBlogComments(slug as string)
      if (error) {
        console.error('Error fetching comments:', error)
      } else {
        setComments(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !newComment.trim()) return

    try {
      setCommentLoading(true)
      
      const commentData = {
        post_id: post!.id,
        user_id: user.id,
        content: newComment.trim()
      }

      const { data, error } = await createBlogComment(commentData)
      
      if (error) {
        console.error('Error creating comment:', error)
        alert('Failed to post comment. Please try again.')
        return
      }

      if (data) {
        setNewComment('')
        fetchComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to post comment. Please try again.')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleShare = async (platform: string) => {
    if (!post) return

    try {
      setShareLoading(prev => ({ ...prev, [platform]: true }))
      
      await incrementPostShares(post.id)
      
      const url = window.location.href
      const text = post.title
      
      let shareUrl = ''
      
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
          break
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          break
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
          break
        case 'copy':
          await navigator.clipboard.writeText(url)
          alert('Link copied to clipboard!')
          return
        default:
          return
      }
      
      window.open(shareUrl, '_blank', 'width=600,height=400')
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setShareLoading(prev => ({ ...prev, [platform]: false }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/blog" className="text-amber-200 hover:text-amber-100 underline mb-4 inline-block">
            ← Back to Blog
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Post Header */}
        <header className="mb-12">
          {post.featured_image && (
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
              />
              {post.is_featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-amber-500 text-black text-sm font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded">
                  {post.category.name}
                </span>
              )}
              <span className="text-gray-400">
                {formatDate(post.created_at)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {post.reading_time || getReadingTime(post.content)} min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl text-gray-300 mb-6">
                {post.subtitle}
              </p>
            )}

            {/* Author Info */}
            {post.author && (
              <div className="flex items-center gap-4">
                {post.author.avatar_url && (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.full_name || ''}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-white">
                    {post.author.full_name || 'Anonymous'}
                  </p>
                  <p className="text-gray-400 capitalize">
                    {post.author.role}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 py-4 border-t border-b border-gray-800">
            <span className="text-gray-400">Share:</span>
            <button
              onClick={() => handleShare('twitter')}
              disabled={shareLoading['twitter']}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              disabled={shareLoading['facebook']}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition disabled:opacity-50"
            >
              Facebook
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              disabled={shareLoading['linkedin']}
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition disabled:opacity-50"
            >
              LinkedIn
            </button>
            <button
              onClick={() => handleShare('copy')}
              disabled={shareLoading['copy']}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
            >
              Copy Link
            </button>
            
            <div className="ml-auto flex items-center gap-4 text-gray-400">
              <span>{post.view_count} views</span>
              <span>{post.share_count} shares</span>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(/\n/g, '<br />') 
            }} 
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span 
                  key={tag.id}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <section className="border-t border-gray-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-8">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
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
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <p className="text-gray-400">
                <Link href="/mui-portal/login" className="text-amber-400 hover:text-amber-300 underline">
                  Sign in
                </Link>
                {' '}to leave a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-800 pb-6">
                  <div className="flex items-start gap-4">
                    {comment.user?.avatar_url && (
                      <Image
                        src={comment.user.avatar_url}
                        alt={comment.user.full_name || ''}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">
                          {comment.user?.full_name || 'Anonymous'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </article>
    </div>
  )
}
