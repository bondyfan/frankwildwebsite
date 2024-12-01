import { google } from 'googleapis';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { videos } from '../src/constants/constants.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE_PATH = join(__dirname, '../src/data/viewsCache.json');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('YOUTUBE_API_KEY environment variable is required');
  process.exit(1);
}

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
});

async function fetchVideoViews(videoId) {
  try {
    const response = await youtube.videos.list({
      part: ['statistics'],
      id: [videoId]
    });

    if (response.data.items && response.data.items.length > 0) {
      return parseInt(response.data.items[0].statistics.viewCount, 10);
    }
    console.warn(`No data found for video ${videoId}`);
    return null;
  } catch (error) {
    console.error(`Error fetching stats for video ${videoId}:`, error.message);
    return null;
  }
}

async function readExistingCache() {
  try {
    const data = await fs.readFile(CACHE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing cache found or invalid JSON');
    return { views: {}, lastUpdated: null };
  }
}

async function updateViewsCache() {
  console.log('Updating views cache...');
  
  // Read existing cache for fallback
  const existingCache = await readExistingCache();
  const newViews = {};
  
  // Process each video
  for (const video of videos) {
    const videoIds = video.videoIds || [video.videoId];
    let totalViews = 0;
    let success = false;
    
    // Try to fetch fresh data for each video ID
    for (const videoId of videoIds) {
      if (!videoId) continue;
      
      const views = await fetchVideoViews(videoId);
      if (views !== null) {
        totalViews += views;
        success = true;
      }
    }
    
    if (success) {
      // Use fresh data if available
      newViews[video.id] = totalViews;
      console.log(`Updated views for ${video.id}: ${totalViews}`);
    } else {
      // Fallback to existing cache if API fails
      newViews[video.id] = existingCache.views[video.id] || 0;
      console.warn(`Using cached data for ${video.id}: ${newViews[video.id]}`);
    }
  }
  
  // Save the new cache
  const cache = {
    lastUpdated: new Date().toISOString(),
    views: newViews
  };
  
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
  console.log('Views cache updated successfully');
}

// Run the update
updateViewsCache().catch(error => {
  console.error('Failed to update views cache:', error);
  process.exit(1);
});
