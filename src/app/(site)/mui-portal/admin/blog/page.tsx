"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import type { BlogPost, BlogCategory, BlogTag, BlogAuthor } from '@/types/blog'

export default function AdminBlogPage() {

  const { user, profile, isAdmin } = useAuth()
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [authors, setAuthors] = useState<BlogAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    meta_title: "",
    meta_description: "",
    keywords: [] as string[],
    status: "draft" as "draft" | "published",
    is_featured: false,
    category_id: "",
    tag_ids: [] as string[],
    author_id: "",
    publish_at: ""
  })

  const [activeTab, setActiveTab] = useState<"posts" | "categories" | "tags">("posts")

  useEffect(() => {
    if (!isAdmin) {
      router.push("/mui-portal/dashboard")
      return
    }

    fetchPosts()
    fetchCategories()
    fetchTags()
    fetchAuthors()

  }, [isAdmin])

  // Refresh categories and tags when switching tabs to ensure they're up to date
  useEffect(() => {
    if (activeTab === "posts") {
      fetchCategories()
      fetchTags()
    }
  }, [activeTab])

  const fetchPosts = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        author:blog_authors(id, name, avatar_url),
        category:blog_categories(id, name, slug),
        tags:blog_post_tags(
          blog_tags(id, name, slug)
        )
      `)
      .order("created_at", { ascending: false })

    if (!error && data) setPosts(data as BlogPost[])
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name")

    if (!error && data) setCategories(data as BlogCategory[])
  }

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .order("name")

    if (!error && data) setTags(data as BlogTag[])
  }

  const fetchAuthors = async () => {
    const { data, error } = await supabase
      .from("blog_authors")
      .select("*")
      .order("name")

    if (!error && data) setAuthors(data as BlogAuthor[])
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({
        ...prev,
        featured_image: publicUrl
      }))
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === "title") {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
        meta_title: value || prev.meta_title
      }))
    }

    if (field === "content") {
      // Calculate reading time (assuming 200 words per minute)
      const words = value.split(/\s+/).length
      const readingTime = Math.ceil(words / 200)
      // This will be set on the server side
    }
  }

  const handleContentFormat = (format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = formData.content.substring(start, end)

    let formatted = selected

    switch (format) {
      case "bold":
        formatted = `**${selected}**`
        break
      case "italic":
        formatted = `*${selected}*`
        break
      case "underline":
        formatted = `<u>${selected}</u>`
        break
      case "h1":
        formatted = `# ${selected}`
        break
      case "h2":
        formatted = `## ${selected}`
        break
      case "h3":
        formatted = `### ${selected}`
        break
      case "quote":
        formatted = `> ${selected}`
        break
      case "numbered":
        formatted = `1. ${selected}`
        break
      case "bullet":
        formatted = `• ${selected}`
        break
    }

    const newContent =
      formData.content.substring(0, start) +
      formatted +
      formData.content.substring(end)

    setFormData(prev => ({
      ...prev,
      content: newContent
    }))
  }

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }))
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...prev.tag_ids, tagId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all required fields
    const requiredFields = [
      { name: 'title', value: formData.title },
      { name: 'slug', value: formData.slug },
      { name: 'content', value: formData.content }
    ]

    for (const field of requiredFields) {
      if (!field.value || field.value.trim() === '') {
        alert(`Please fill in the ${field.name} field.`)
        return
      }
    }

    // Ensure author_id is set to current user if not provided
    const authorId = formData.author_id || user?.id

    if (!authorId) {
      alert("You must be logged in to create a post.")
      return
    }

    // Ensure category_id is set - use first available category if none selected
    let categoryId = formData.category_id
    if (!categoryId && categories.length > 0) {
      categoryId = categories[0].id
      alert(`Category automatically set to: ${categories[0].name}`)
    }

    if (!categoryId) {
      alert("Please select a category for the post, or create a category first.")
      return
    }

    // Debug log to verify all required fields
    console.log('Creating blog post with data:', {
      title: formData.title,
      slug: formData.slug,
      content: formData.content.substring(0, 100) + '...',
      author_id: authorId,
      category_id: categoryId,
      status: formData.status
    })

    setLoading(true)

    const postData = {
      title: formData.title,
      subtitle: formData.subtitle,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      featured_image: formData.featured_image,
      status: formData.status,
      featured: formData.is_featured,
      category_id: categoryId,
      author_id: authorId,
      published_at: formData.status === 'published' ? new Date().toISOString() : null
    }

    try {
      let postId: string
      
      // Create the post
      if (editingPost) {
        const { data, error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id)
          .select()
          .single()

        if (error) throw error
        postId = data.id
      } else {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert(postData)
          .select()
          .single()

        if (error) throw error
        postId = data.id
      }

      // Update tags
      if (formData.tag_ids.length > 0) {
        const tagRelations = formData.tag_ids.map(tagId => ({
          post_id: postId,
          tag_id: tagId
        }))

        // Delete existing tags
        await supabase
          .from("blog_post_tags")
          .delete()
          .eq("post_id", postId)

        // Insert new tags
        await supabase
          .from("blog_post_tags")
          .insert(tagRelations)
      }

      resetForm()
      setShowEditor(false)
      setEditingPost(null)
      await fetchPosts()

    } catch (err) {
      console.error(err)
      alert("Error saving post")
    }

    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      slug: "",
      content: "",
      excerpt: "",
      featured_image: "",
      meta_title: "",
      meta_description: "",
      keywords: [],
      status: "draft",
      is_featured: false,
      category_id: "",
      tag_ids: [],
      author_id: "",
      publish_at: ""
    })
  }

  const editPost = (post: BlogPost) => {
    setEditingPost(post)

    setFormData({
      title: post.title,
      subtitle: post.subtitle || "",
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featured_image: post.featured_image || "",
      meta_title: "",
      meta_description: "",
      keywords: [],
      status: post.status,
      is_featured: post.featured || false,
      category_id: post.category_id || "",
      tag_ids: post.tags?.map(tag => tag.id) || [],
      author_id: post.author_id || "",
      publish_at: post.published_at || ""
    })

    setShowEditor(true)
  }

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id)

    if (!error) fetchPosts()
  }

  const publishPost = async (id: string) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ status: 'published', publish_at: new Date().toISOString() })
      .eq("id", id)

    if (!error) fetchPosts()
  }

  const unpublishPost = async (id: string) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ status: 'draft' })
      .eq("id", id)

    if (!error) fetchPosts()
  }

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    )

  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Admin</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                fetchPosts()
                fetchCategories()
                fetchTags()
                fetchAuthors()
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowEditor(true)}
              className="bg-amber-500 text-black px-4 py-2 rounded"
            >
              New Post
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 px-1 ${activeTab === "posts" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-400"}`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-2 px-1 ${activeTab === "categories" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-400"}`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`pb-2 px-1 ${activeTab === "tags" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-400"}`}
          >
            Tags
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div>
            {/* Posts Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-2">Title</th>
                    <th className="text-left py-3 px-2">Author</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Views</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} className="border-b border-gray-800">
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium">{post.title}</div>
                          {post.featured && (
                            <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">{post.author?.name || 'Unknown'}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          post.status === 'published' ? 'bg-green-500 text-white' :
                          post.status === 'draft' ? 'bg-gray-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">{post.views || 0}</td>
                      <td className="py-3 px-2">{new Date(post.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editPost(post)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          {post.status === 'draft' ? (
                            <button
                              onClick={() => publishPost(post.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => unpublishPost(post.id)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Posts Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-800 p-4 rounded">
                <h3 className="font-semibold mb-3">Most Viewed</h3>
                <div className="space-y-2">
                  {posts
                    .filter(p => p.views > 0)
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5)
                    .map(post => (
                      <div key={post.id} className="text-sm">
                        <div className="font-medium">{post.title}</div>
                        <div className="text-gray-400">{post.views} views</div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border border-gray-800 p-4 rounded">
                <h3 className="font-semibold mb-3">Most Shared</h3>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">No share data available</p>
                </div>
              </div>

              <div className="border border-gray-800 p-4 rounded">
                <h3 className="font-semibold mb-3">Featured Posts</h3>
                <div className="space-y-2">
                  {posts
                    .filter(p => p.featured)
                    .slice(0, 5)
                    .map(post => (
                      <div key={post.id} className="text-sm">
                        <div className="font-medium">{post.title}</div>
                        <div className="text-gray-400">{post.status}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor */}
        {showEditor && (
          <div className="mt-10 bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">
              {editingPost ? "Edit Post" : "New Post"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Post title"
                    value={formData.title}
                    onChange={e => handleInputChange("title", e.target.value)}
                    className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-2">
                    Slug *
                  </label>
                  <input
                    id="slug"
                    type="text"
                    placeholder="post-url-slug"
                    value={formData.slug}
                    onChange={e => handleInputChange("slug", e.target.value)}
                    className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium mb-2">
                  Subtitle
                </label>
                <input
                  id="subtitle"
                  type="text"
                  placeholder="Post subtitle"
                  value={formData.subtitle}
                  onChange={e => handleInputChange("subtitle", e.target.value)}
                  className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={3}
                  placeholder="Brief description of the post"
                  value={formData.excerpt}
                  onChange={e => handleInputChange("excerpt", e.target.value)}
                  className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                />
              </div>

              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Featured Image
                </label>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 disabled:opacity-50"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                  {formData.featured_image && (
                    <div className="mt-2">
                      <img
                        src={formData.featured_image}
                        alt="Featured"
                        className="h-32 w-auto rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange("featured_image", "")}
                        className="mt-2 text-red-400 text-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content *
                </label>
                
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-800 rounded">
                  <button
                    type="button"
                    onClick={() => handleContentFormat("bold")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    <strong>Bold</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("italic")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    <em>Italic</em>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("underline")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    <u>Underline</u>
                  </button>
                  <div className="w-px bg-gray-600"></div>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("h1")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("h2")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("h3")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    H3
                  </button>
                  <div className="w-px bg-gray-600"></div>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("numbered")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    1.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("bullet")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    •
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContentFormat("quote")}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
                  >
                    "
                  </button>
                </div>

                <textarea
                  id="content"
                  ref={textareaRef}
                  rows={12}
                  placeholder="Write your article..."
                  value={formData.content}
                  onChange={e => handleInputChange("content", e.target.value)}
                  className="w-full p-3 bg-black border border-gray-700 rounded text-white font-mono text-sm"
                  required
                />
              </div>

              {/* SEO Section */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">SEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="meta_title" className="block text-sm font-medium mb-2">
                      Meta Title
                    </label>
                    <input
                      id="meta_title"
                      type="text"
                      placeholder="SEO title (60 chars max)"
                      value={formData.meta_title}
                      onChange={e => handleInputChange("meta_title", e.target.value)}
                      maxLength={60}
                      className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="meta_description" className="block text-sm font-medium mb-2">
                      Meta Description
                    </label>
                    <textarea
                      id="meta_description"
                      rows={2}
                      placeholder="SEO description (160 chars max)"
                      value={formData.meta_description}
                      onChange={e => handleInputChange("meta_description", e.target.value)}
                      maxLength={160}
                      className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    />
                  </div>
                </div>

                {/* Keywords */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Keywords
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleKeywordRemove(keyword)}
                          className="font-bold hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add keyword"
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleKeywordAdd(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                      className="flex-1 p-2 bg-black border border-gray-700 rounded text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add keyword"]') as HTMLInputElement
                        if (input?.value) {
                          handleKeywordAdd(input.value)
                          input.value = ''
                        }
                      }}
                      className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Category and Tags */}
              <div className="border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category_id}
                      onChange={e => handleInputChange("category_id", e.target.value)}
                      className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-700 rounded p-2">
                      {tags.map(tag => (
                        <label key={tag.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.tag_ids.includes(tag.id)}
                            onChange={() => handleTagToggle(tag.id)}
                            className="rounded"
                          />
                          {tag.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Publishing */}
              <div className="border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={e => handleInputChange("status", e.target.value)}
                      className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium mb-2">
                      Author
                    </label>
                    <select
                      id="author"
                      value={formData.author_id}
                      onChange={e => handleInputChange("author_id", e.target.value)}
                      className="w-full p-3 bg-black border border-gray-700 rounded text-white"
                    >
                      <option value="">Select author</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => handleInputChange("is_featured", e.target.checked)}
                      className="rounded"
                    />
                    Featured Post
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 border-t border-gray-700 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 text-black px-6 py-2 rounded hover:bg-amber-400 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false)
                    setEditingPost(null)
                    resetForm()
                  }}
                  className="bg-gray-700 px-6 py-2 rounded text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Slug</th>
                      <th className="text-left py-3 px-2">Description</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category.id} className="border-b border-gray-800">
                        <td className="py-3 px-2 font-medium">{category.name}</td>
                        <td className="py-3 px-2 text-gray-400">{category.slug}</td>
                        <td className="py-3 px-2 text-gray-400">{category.description || '-'}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => {
                              if (confirm('Delete this category?')) {
                                supabase
                                  .from('blog_categories')
                                  .delete()
                                  .eq('id', category.id)
                                  .then(() => fetchCategories())
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h4 className="font-semibold mb-4">Add New Category</h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const name = formData.get('name') as string
                  const categoryData = {
                    name: name,
                    slug: formData.get('slug') as string || generateSlug(name),
                    description: formData.get('description') as string
                  }
                  
                  try {
                    const { error } = await supabase
                      .from('blog_categories')
                      .insert(categoryData)
                    
                    if (error) throw error
                    
                    fetchCategories()
                    e.currentTarget.reset()
                    
                    // Show success message
                    alert('Category added successfully!')
                  } catch (error) {
                    console.error('Error adding category:', error)
                    alert('Error adding category. Please try again.')
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Category name *"
                    required
                    className="p-3 bg-black border border-gray-700 rounded text-white"
                  />
                  <input
                    name="slug"
                    type="text"
                    placeholder="category-slug (optional, auto-generated)"
                    className="p-3 bg-black border border-gray-700 rounded text-white"
                  />
                </div>
                <input
                  name="description"
                  type="text"
                  placeholder="Description"
                  className="p-3 bg-black border border-gray-700 rounded text-white"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-black px-6 py-2 rounded hover:bg-amber-400"
                >
                  Add Category
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === "tags" && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Slug</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map(tag => (
                      <tr key={tag.id} className="border-b border-gray-800">
                        <td className="py-3 px-2 font-medium">{tag.name}</td>
                        <td className="py-3 px-2 text-gray-400">{tag.slug}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => {
                              if (confirm('Delete this tag?')) {
                                supabase
                                  .from('blog_tags')
                                  .delete()
                                  .eq('id', tag.id)
                                  .then(() => fetchTags())
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h4 className="font-semibold mb-4">Add New Tag</h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const name = formData.get('name') as string
                  const tagData = {
                    name: name,
                    slug: formData.get('slug') as string || generateSlug(name)
                  }
                  
                  try {
                    const { error } = await supabase
                      .from('blog_tags')
                      .insert(tagData)
                    
                    if (error) throw error
                    
                    fetchTags()
                    e.currentTarget.reset()
                    
                    // Show success message
                    alert('Tag added successfully!')
                  } catch (error) {
                    console.error('Error adding tag:', error)
                    alert('Error adding tag. Please try again.')
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Tag name *"
                    required
                    className="p-3 bg-black border border-gray-700 rounded text-white"
                  />
                  <input
                    name="slug"
                    type="text"
                    placeholder="tag-slug (optional, auto-generated)"
                    className="p-3 bg-black border border-gray-700 rounded text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-500 text-black px-6 py-2 rounded hover:bg-amber-400"
                >
                  Add Tag
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}