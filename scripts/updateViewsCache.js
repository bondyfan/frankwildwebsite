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

async function readExistingCache() {
  try {
    const data = await fs.readFile(CACHE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing cache found or invalid JSON');
    return { views: {}, lastUpdated: null };
  }
}

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

async function updateViewsCache() {
  try {
    const existingCache = await readExistingCache();
    const viewsData = { ...existingCache.views };
    let hasNewData = false;

    // Process all videos
    for (const video of videos) {
      if (video.videoIds) {
        // Handle multiple video IDs (like Hafo)
        let totalViews = 0;
        let validCount = 0;
        
        for (const id of video.videoIds) {
          const views = await fetchVideoViews(id);
          if (views !== null) {
            totalViews += views;
            validCount++;
          }
        }

        // Only update if we got at least one valid view count
        if (validCount > 0) {
          viewsData[video.id] = totalViews;
          hasNewData = true;
        }
      } else if (video.videoId) {
        // Handle single video ID
        const views = await fetchVideoViews(video.videoId);
        if (views !== null) {
          viewsData[video.id] = views;
          hasNewData = true;
        }
      }
    }

    // Only write to cache if we got new data
    if (hasNewData) {
      const cacheData = {
        views: viewsData,
        lastUpdated: new Date().toISOString()
      };

      await fs.writeFile(CACHE_PATH, JSON.stringify(cacheData, null, 2));
      console.log('Views cache updated successfully');
    } else {
      console.log('No new data fetched, keeping existing cache');
    }
  } catch (error) {
    console.error('Error updating views cache:', error);
    process.exit(1);
  }
}

updateViewsCache();
