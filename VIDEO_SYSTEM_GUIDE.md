# Simplified Video System Guide

## Overview

The video system has been simplified to make it as easy as possible to add videos. You now only need to:
1. Paste a YouTube URL
2. Fill in basic video metadata
3. The system automatically fetches the thumbnail and handles playback

## Adding a New Video

### In Sanity Studio:

1. **Go to Videos** in your Sanity Studio dashboard
2. **Create a new Video document**
3. **Fill in the required fields:**
   - **Title**: Video title (e.g., "Campus Dialogue on Faith")
   - **YouTube Video URL**: Paste the full YouTube link
     - Examples:
       - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
       - `https://youtu.be/dQw4w9WgXcQ`
       - `https://www.youtube.com/embed/dQw4w9WgXcQ`
   - **Video Type**: Choose from Podcast, Talk, Documentary, Interview, Workshop, Event
   - **Category**: Select the appropriate category
   - **Campus**: Enter the campus name
   - **Duration**: Enter as "XX min" (e.g., "12 min")

4. **Optional settings:**
   - **Featured**: Check to show in the featured hero section
   - **Show in Rail**: Check to include in the homepage playlist (checked by default)
   - **Published At**: Auto-set to now, change if needed
   - **Order**: For manual ordering (lower numbers appear first)

5. **Save the document**

### Auto-Features:

✅ **YouTube ID** - Automatically extracted from the URL  
✅ **Thumbnail** - Auto-fetched from YouTube  
✅ **Preview** - Shows thumbnail in Sanity Studio  
✅ **Playback** - Video plays on the site automatically using the YouTube embed

## How It Works

### URL Formats Supported:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

The system extracts the 11-character YouTube ID and uses it for:
- **Thumbnail URL**: `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg`
- **Player embed**: `https://www.youtube.com/embed/{VIDEO_ID}`

### On The Frontend:

1. **Featured Conversations** - Top video with full description
2. **Top Conversations** - Recent videos in a list
3. **Video Page** - Full-screen YouTube player with recommendations

## Migration: Updating Existing Videos

If you have existing videos without YouTube URLs, you'll need to add them manually in Sanity Studio.

To auto-populate `youtubeId` for videos that already have `youtubeUrl`:

```bash
# Run the migration script
node scripts/migrate-youtube-ids.js
```

This will extract all YouTube IDs from existing URLs.

## Required Environment Variables

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token (for migrations)
```

## Troubleshooting

### "Could not extract YouTube ID"
- Make sure you're using a valid YouTube URL
- Supported formats: youtube.com/watch?v=... or youtu.be/...
- Don't include extra parameters that might confuse the parser

### Video doesn't appear on the site
- Check that `youtubeId` field is populated
- Check that `showInRail` or `featured` is enabled
- Make sure `publishedAt` is not in the future
- Check expiry date if set

### Thumbnail not loading
- The YouTube ID must be correct (11 alphanumeric characters)
- Verify the URL extracts correctly in Sanity
- Try refreshing the page

## API Response Structure

Videos returned from the API include:

```typescript
{
  _id: string              // Unique document ID
  title: string            // Video title
  description: string      // Video description
  youtubeId: string        // YouTube video ID
  youtubeUrl: string       // Full YouTube URL
  type: string             // Video type
  category: string         // Category
  campus: string           // Campus
  duration: string         // Duration (e.g., "12 min")
  featured: boolean        // Featured flag
  showInRail: boolean      // Show in rail flag
  publishedAt: string      // Publication date
  expiryDate?: string      // Optional expiry date
  order: number            // Sort order
}
```

## Frontend Usage

### Featured Video
```tsx
<FeaturedVideoHero />
```

### Top Conversations List
```tsx
<TopConversations />
```

### Access All Videos
```tsx
const result = await getVideos({ limit: 10 })
const videos = result.data
```

### Filter by Type
```tsx
const result = await getVideos({ type: 'podcast', limit: 5 })
```
