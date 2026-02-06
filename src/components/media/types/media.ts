/* ----------------------------------
   Flexible content descriptors
----------------------------------- */

export type MediaType = string;
/*
  Examples:
  "podcast" | "talk" | "documentary" | "playlist"
*/

export type MediaCategory = string;
/*
  Examples:
  "Student Life"
  "Campus Conversations"
  "Faith & Spiritual Growth"
*/

/* ----------------------------------
   Platforms
----------------------------------- */

export type MediaPlatform =
  | "youtube"
  | "spotify"
  | "apple"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "x"
  | "linkedin";

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

/* ----------------------------------
   Core Media Item
----------------------------------- */

export interface MediaItem {
  id: string;

  /** Content classification */
  type: MediaType;
  category: MediaCategory;

  /** Core metadata */
  title: string;
  description: string;
  campus: string;
  duration?: string;

  /** Video support */
  youtubeId?: string;
  thumbnail: string;

  /** Distribution */
  primaryPlatform: MediaPlatform;
  externalUrl?: string;
  social: MediaSocialLinks;

  /** State & editorial control */
  comingSoon?: boolean;

  /** Editorial hero control */
  featured?: boolean;

  /** Visibility control (PlaylistsRail, homepage rails, etc.) */
  showInRail?: boolean;
}
