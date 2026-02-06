// types/video.ts
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  platform: "youtube" | "tiktok" | "instagram" | "spotify" | "other";
  creator: string;
  views?: number;
  publishedAt?: string;

  videoUrl: string;          // PRIMARY watch link
  channelUrl?: string;       // Creator page
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;

  category: string;
}
