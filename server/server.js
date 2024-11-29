require('dotenv').config();
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const axios = require('axios');

const app = express();
const cache = new NodeCache({ stdTTL: 86400 }); // Change cache TTL to 24 hours (86400 seconds)

// Enable CORS for all routes with specific origin
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Track API calls
let apiCallCount = 0;
const lastApiCall = {
  timestamp: null,
  counts: {}
};

// Video ID mapping
const VIDEO_IDS = {
  "Upír Dex": "aMXdZODjmqA",
  "Vezmu Si Tě Do Pekla": "Wm8QjIHEXqY",
  "Hafo": "Oe4ZOWtYgKY",
  "Zabil Jsem Svou Holku": "Oe4ZOWtYgKY",
  "Bunny Hop": "Oe4ZOWtYgKY",
  "HOT": "Oe4ZOWtYgKY"
};

async function fetchVideoStats(videoId) {
  try {
    apiCallCount++;
    const currentDate = new Date().toISOString().split('T')[0];
    lastApiCall.counts[currentDate] = (lastApiCall.counts[currentDate] || 0) + 1;
    lastApiCall.timestamp = new Date().toISOString();
    
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'statistics',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (response.data.items && response.data.items[0]) {
      return response.data.items[0].statistics.viewCount;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching stats for video ${videoId}:`, error);
    return null;
  }
}

// Add monitoring endpoint
app.get('/api/monitor', (req, res) => {
  const stats = {
    totalApiCalls: apiCallCount,
    lastApiCall: lastApiCall.timestamp,
    dailyCounts: lastApiCall.counts,
    cacheStats: {
      keys: cache.keys(),
      stats: cache.getStats()
    }
  };
  res.json(stats);
});

app.get('/api/youtube-stats', async (req, res) => {
  console.log('Received request for YouTube stats');
  try {
    // Check cache first
    const cachedStats = cache.get('youtube-stats');
    if (cachedStats) {
      console.log('Returning cached stats:', cachedStats);
      return res.json(cachedStats);
    }

    console.log('Cache miss, fetching fresh stats from YouTube API');
    // Fetch real stats from YouTube API
    const stats = {};
    for (const [title, videoId] of Object.entries(VIDEO_IDS)) {
      console.log(`Fetching stats for video: ${title} (${videoId})`);
      const views = await fetchVideoStats(videoId);
      if (views) {
        stats[title] = parseInt(views);
      }
    }

    // Cache the results
    console.log('Caching and returning fresh stats:', stats);
    cache.set('youtube-stats', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching YouTube stats:', error);
    res.status(500).json({ error: 'Failed to fetch video stats' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API monitoring available at http://localhost:${PORT}/api/monitor`);
});
