"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPost, getBlogComments, incrementPostViews, incrementPostShares } from '@/lib/blog.client'
import { useAuth } from '@/contexts/auth-context'
import type { SanityPostWithRelations, BlogComment } from '@/types/blog'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import customComponents from '@/components/blog/PortableTextComponents'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { user, profile, isAdmin } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState<SanityPostWithRelations | null>(null)
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [shareLoading, setShareLoading] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  useEffect(() => {
    if (post) {
      fetchComments()
      // Track view after post loads
      incrementPostViews(slug as string)
    }
  }, [post?._id])

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
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!post?._id) return

    try {
      const { data, error } = await getBlogComments(post._id)

      if (error) {
        console.error('Error fetching comments:', error)
        return
      }

      if (data) {
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleShare = async (platform: string) => {
    if (!post?._id) return

    setShareLoading(prev => ({ ...prev, [platform]: true }))

    try {
      const { error } = await incrementPostShares(post._id)

      if (error) {
        console.error('Error incrementing shares:', error)
        return
      }

      // Share URL logic would go here
      const url = window.location.href
      const text = `Check out this article: ${post.title}`

      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
          break
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
          break
        default:
          navigator.clipboard.writeText(url)
          alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setShareLoading(prev => ({ ...prev, [platform]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-8 w-3/4"></div>
            <div className="h-64 bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
          <Link href="/blog" className="text-amber-400 hover:text-amber-300">
            ← Back to blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/blog" className="text-amber-400 hover:text-amber-300">
            ← Back to blog
          </Link>
        </nav>

        {/* Article Meta */}
        <header className="mb-8">
          {post.categories && post.categories.length > 0 && (
            <div className="mb-4">
              {post.categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug.current}`}
                  className="inline-block bg-amber-900 text-amber-100 px-3 py-1 rounded-full text-sm font-medium mr-2 hover:bg-amber-800"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between text-gray-400 border-b border-gray-700 pb-6">
            <div className="flex items-center space-x-4">
              {post.author && (
                <div className="flex items-center space-x-2">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).width(40).height(40).url()}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-white">{post.author.name}</p>
                    {post.publishedAt && (
                      <p className="text-sm">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm">
              {post.readTime && (
                <span>{post.readTime} min read</span>
              )}
              {post.views && (
                <span>{post.views} views</span>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="mb-8">
            <Image
              src={urlFor(post.mainImage).width(800).height(400).url()}
              alt={post.mainImage.alt || post.title}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <PortableText
            value={post.body}
            components={customComponents}
          />
        </div>

        {/* Share Buttons */}
        <div className="border-t border-gray-700 pt-8 mb-12">
          <h3 className="text-lg font-semibold text-white mb-4">Share this article</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleShare('twitter')}
              disabled={shareLoading.twitter}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {shareLoading.twitter ? 'Sharing...' : 'Twitter'}
            </button>
            <button
              onClick={() => handleShare('facebook')}
              disabled={shareLoading.facebook}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {shareLoading.facebook ? 'Sharing...' : 'Facebook'}
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              disabled={shareLoading.linkedin}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {shareLoading.linkedin ? 'Sharing...' : 'LinkedIn'}
            </button>
            <button
              onClick={() => handleShare('copy')}
              disabled={shareLoading.copy}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {shareLoading.copy ? 'Copying...' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="border-t border-gray-700 pt-8">
          <h3 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h3>

          {comments.length === 0 ? (
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {'image' in comment.author && comment.author.image && (
                      <Image
                        src={urlFor(comment.author.image).width(32).height(32).url()}
                        alt={'name' in comment.author ? comment.author.name : 'Anonymous'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-white">{'name' in comment.author ? comment.author.name : 'Anonymous'}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(comment._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <PortableText value={comment.content} components={customComponents} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form - Placeholder for now */}
          {user ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Leave a comment</h4>
              <p className="text-gray-300">Commenting functionality will be implemented soon.</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-300">Please log in to leave a comment.</p>
            </div>
          )}
        </section>
      </article>
    </div>
  )
}
