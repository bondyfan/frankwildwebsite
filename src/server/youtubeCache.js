import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { videos } from '../constants/constants.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CACHE_FILE = 'youtube-cache.json';
const API_KEY = process.env.VITE_YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('YouTube API key not found in environment variables');
  process.exit(1);
}

console.log('YouTube cache service initialized');

let cacheInitialized = false;

async function readCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    const cache = JSON.parse(data);
    console.log('Youtube Cache file read successfully');
    return cache;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No Youtube cache file found, will create new cache');
      return null;
    }
    console.error('Error reading cache:', error);
    return null;
  }
}

async function writeCache(data) {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log('Youtube Cache file updated successfully');
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

async function fetchVideoStats(videoId) {
  try {
    console.log(`Fetching stats for video ${videoId} from YouTube API`);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
    );
    return response.data.items?.[0]?.statistics?.viewCount || '0';
  } catch (error) {
    console.error(`Error fetching stats for video ${videoId}:`, error);
    return '0';
  }
}

function isCacheValid(cache) {
  if (!cache || !cache.lastUpdate) {
    console.log('Youtube Cache validation: No cache or lastUpdate missing');
    return false;
  }

  const lastUpdate = new Date(cache.lastUpdate);
  const now = new Date();
  
  // Check if less than 12 hours have passed
  const hoursSinceLastUpdate = (now - lastUpdate) / (1000 * 60 * 60);
  const isValid = hoursSinceLastUpdate < 12;

  console.log(`Youtube Cache validation: Last update was ${lastUpdate.toLocaleString()}`);
  console.log(`Youtube Cache validation: Hours since last update: ${hoursSinceLastUpdate.toFixed(2)}`);
  console.log(`Youtube Cache validation result: ${isValid ? 'VALID (< 12 hours)' : 'INVALID (> 12 hours)'}`);

  return isValid;
}

let dailyUpdateInProgress = false;

async function updateCache() {
  try {
    // If cache is already initialized, just return the existing cache
    if (cacheInitialized) {
      console.log('Youtube Cache already initialized, using existing data');
      const cache = await readCache();
      return cache?.data || {};
    }

    // Prevent concurrent updates
    if (dailyUpdateInProgress) {
      console.log('Youtube Cache update already in progress, waiting...');
      return null;
    }

    const cache = await readCache();
    
    // If cache exists and was updated today, return it
    if (cache && isCacheValid(cache)) {
      console.log('Using cached YouTube stats from today');
      cacheInitialized = true;
      return cache.data;
    }

    // Set update flag
    dailyUpdateInProgress = true;

    console.log('Starting fresh YouTube API data fetch');
    // Fetch fresh data for all videos
    const newData = {};
    for (const video of videos) {
      if (video.videoIds) {
        // Handle multiple videos (like Hafo)
        let totalViews = 0;
        for (const id of video.videoIds) {
          const views = await fetchVideoStats(id);
          totalViews += parseInt(views) || 0;
        }
        newData[video.title] = totalViews;
      } else {
        // Handle single video
        const views = await fetchVideoStats(video.videoId);
        newData[video.title] = parseInt(views) || 0;
      }
    }

    // Save new cache with current date
    const cacheData = {
      lastUpdate: new Date().toISOString(),
      data: newData
    };
    await writeCache(cacheData);
    console.log('New YouTube stats cached successfully');

    // Reset flags
    dailyUpdateInProgress = false;
    cacheInitialized = true;

    return newData;
  } catch (error) {
    console.error('Error updating Youtube cache:', error);
    // Reset flags on error
    dailyUpdateInProgress = false;
    cacheInitialized = false;
    // Return existing cache if available
    const cache = await readCache();
    return cache?.data || {};
  }
}

export async function getVideoStats() {
  try {
    const cache = await readCache();
    if (cache && isCacheValid(cache)) {
      console.log('Serving cached YouTube stats');
      return cache.data;
    }
    return await updateCache();
  } catch (error) {
    console.error('Error getting Youtube video stats:', error);
    return {};
  }
}

// Initialize cache on module load
console.log('Checking Youtube cache status on startup...');
updateCache().then(() => {
  console.log('Initial Youtube cache check completed');
});
