// src/components/media/types/mediaTypes.ts
export type MediaType = "podcast" | "talk" | "documentary" | string;

export type MediaCategory =
  | "Faith & Spiritual Growth"
  | "Student Life"
  | "Personal Growth"
  | string;

export interface MediaSocialLinks {
  youtube?: string | null;
  spotify?: string | null;
  apple?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  x?: string | null;
  linkedin?: string | null;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  category: MediaCategory;
  title: string;
  description: string;
  campus: string;
  duration?: string;
  youtubeId?: string;
  thumbnail: string;
  primaryPlatform: keyof MediaSocialLinks;
  externalUrl?: string;
  social: MediaSocialLinks;
  comingSoon?: boolean;
  featured?: boolean;
  showInRail?: boolean;
}
