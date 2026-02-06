import { MediaItem, MediaCategory } from "./media";

export type PlaylistKey =
  | "faith"
  | "student-life"
  | "personal-growth"
  | "talks"
  | "podcasts";

export const PLAYLISTS: Record<PlaylistKey, { title: string; description?: string }> = {
  faith: {
    title: "Faith & Spiritual Growth",
    description: "Conversations and teachings that strengthen faith",
  },
  "student-life": {
    title: "Student Life",
    description: "Campus, purpose, pressure, and growth",
  },
  "personal-growth": {
    title: "Personal Growth",
    description: "Mindset, discipline, leadership",
  },
  talks: {
    title: "Talks & Panels",
  },
  podcasts: {
    title: "Podcasts",
  },
};

/**
 * Build a mapping of playlists from an array of MediaItem
 * Only includes categories that match the defined PlaylistKey
 */
export function buildPlaylists(videos: MediaItem[]): Partial<Record<PlaylistKey, MediaItem[]>> {
  const playlists: Partial<Record<PlaylistKey, MediaItem[]>> = {};

  videos.forEach(video => {
    // Map MediaCategory to PlaylistKey if it exists
    let key: PlaylistKey | undefined;

    switch (video.category) {
      case "Faith":
        key = "faith";
        break;
      case "Student Life":
        key = "student-life";
        break;
      case "Personal Growth":
        key = "personal-growth";
        break;
      case "Mental Health":
        key = "talks";
        break;
      case "Culture": 
        key = "podcasts";
        break;
      default:
        key = undefined;
    }

    if (!key) return;

    if (!playlists[key]) playlists[key] = [];
    playlists[key]!.push(video);
  });

  return playlists;
}
