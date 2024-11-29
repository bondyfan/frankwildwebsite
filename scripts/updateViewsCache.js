const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

async function updateViewsCache() {
  try {
    // Fetch latest view counts
    const response = await axios.get(`${API_URL}/api/youtube-stats`);
    
    const cacheData = {
      lastUpdated: new Date().toISOString(),
      views: response.data
    };

    // Write to the cache file
    const cachePath = path.join(__dirname, '../src/data/viewsCache.json');
    await fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2));
    
    console.log('Successfully updated views cache');
  } catch (error) {
    console.error('Error updating views cache:', error);
    process.exit(1);
  }
}

updateViewsCache();
