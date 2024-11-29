const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Import video IDs from constants
const { videos } = require('../src/constants/constants');

const CACHE_PATH = path.join(__dirname, '../src/data/viewsCache.json');
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
    return 0;
  } catch (error) {
    console.error(`Error fetching stats for video ${videoId}:`, error.message);
    return 0;
  }
}

async function updateViewsCache() {
  try {
    const viewsData = {};

    // Process all videos
    for (const video of videos) {
      if (video.videoIds) {
        // Handle multiple video IDs (like Hafo)
        let totalViews = 0;
        for (const id of video.videoIds) {
          const views = await fetchVideoViews(id);
          totalViews += views;
        }
        viewsData[video.title] = totalViews;
      } else if (video.videoId) {
        // Handle single video ID
        const views = await fetchVideoViews(video.videoId);
        viewsData[video.title] = views;
      }
    }

    const cacheData = {
      lastUpdated: new Date().toISOString(),
      views: viewsData
    };

    await fs.writeFile(CACHE_PATH, JSON.stringify(cacheData, null, 2));
    console.log('Successfully updated views cache with YouTube data');
    
  } catch (error) {
    console.error('Error in cache update process:', error);
    process.exit(1);
  }
}

updateViewsCache();
