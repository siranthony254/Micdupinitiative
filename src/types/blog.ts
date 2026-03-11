export interface BlogAuthor {
  id: string
  name: string
  bio?: string
  avatar_url?: string
  twitter?: string
  linkedin?: string
  created_at: string
  updated_at: string
}

export interface BlogProfile {
  id: string
  full_name?: string
  avatar_url?: string
  bio?: string
  role: 'author' | 'editor' | 'admin'
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  subtitle?: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  status: 'draft' | 'published'
  featured: boolean
  read_time: number
  views: number
  author_id?: string
  category_id?: string
  published_at?: string
  created_at: string
  updated_at: string
  author?: BlogAuthor
  category?: BlogCategory
  tags?: BlogTag[]
}

export interface BlogComment {
  id: string
  post_id: string
  user_id?: string
  content: string
  is_approved: boolean
  created_at: string
  user?: BlogProfile
}

export interface BlogPostView {
  id: string
  post_id: string
  viewer_ip?: string
  user_agent?: string
  created_at: string
}

export interface BlogPostShare {
  id: string
  post_id: string
  platform?: string
  created_at: string
}

export interface BlogPostWithRelations extends BlogPost {
  author?: BlogAuthor
  category?: BlogCategory
  tags?: BlogTag[]
  comments?: BlogComment[]
}
