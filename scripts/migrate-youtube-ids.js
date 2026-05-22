#!/usr/bin/env node

/**
 * Migration script to extract YouTube IDs from YouTube URLs in Sanity
 * Run with: node scripts/migrate-youtube-ids.js
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get directory of this file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local from project root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing required environment variables:')
  if (!projectId) console.error('- NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!dataset) console.error('- NEXT_PUBLIC_SANITY_DATASET')
  if (!token) console.error('- SANITY_API_TOKEN')
  console.error('\nMake sure these are set in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  token,
  apiVersion: '2024-01-01',
})

function extractYouTubeId(url) {
  if (!url) return null
  try {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (match?.[1]) return match[1]
    const match2 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
    if (match2?.[1]) return match2[1]
  } catch (error) {
    console.error('Error extracting ID:', error)
  }
  return null
}

async function migrateYouTubeIds() {
  console.log('Starting YouTube ID migration...')

  try {
    // Fetch all video documents
    const videos = await client.fetch(`*[_type == "video"] {_id, youtubeUrl, youtubeId}`)
    
    console.log(`Found ${videos.length} video(s)`)

    let updated = 0
    let errors = 0

    for (const video of videos) {
      if (!video.youtubeUrl) {
        console.log(`Skipping ${video._id}: no youtubeUrl`)
        continue
      }

      const extractedId = extractYouTubeId(video.youtubeUrl)
      
      if (!extractedId) {
        console.log(`ERROR: Could not extract ID from URL: ${video.youtubeUrl}`)
        errors++
        continue
      }

      // Only update if different
      if (video.youtubeId !== extractedId) {
        try {
          await client.patch(video._id).set({ youtubeId: extractedId }).commit()
          console.log(`✓ Updated ${video._id}: youtubeId = ${extractedId}`)
          updated++
        } catch (error) {
          console.error(`✗ Error updating ${video._id}:`, error)
          errors++
        }
      } else {
        console.log(`- ${video._id}: already has correct ID`)
      }
    }

    console.log(`\nMigration complete!`)
    console.log(`Updated: ${updated}, Errors: ${errors}`)
    process.exit(errors > 0 ? 1 : 0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrateYouTubeIds()
