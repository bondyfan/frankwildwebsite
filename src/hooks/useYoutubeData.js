import { useState, useEffect } from 'react';
import axios from 'axios';
import { VIDEO_IDS } from '../constants/constants';
import { YOUTUBE_API_KEY } from '../config';

// Global cache for YouTube data
let globalCache = null;
let isFetching = false;
const subscribers = new Set();

const notifySubscribers = (data) => {
  subscribers.forEach(callback => callback(data));
};

async function fetchYouTubeData() {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  const url = 'https://www.googleapis.com/youtube/v3/videos';
  const videoIds = Object.values(VIDEO_IDS).join(',');
  
  const response = await axios.get(url, {
    params: {
      part: 'statistics',
      id: videoIds,
      key: YOUTUBE_API_KEY
    }
  });

  if (!response.data || !response.data.items) {
    throw new Error('Invalid response from YouTube API');
  }

  // Process the response
  const viewsData = {};
  response.data.items.forEach(item => {
    const title = Object.entries(VIDEO_IDS).find(([_, id]) => id === item.id)?.[0];
    if (title) {
      viewsData[title] = parseInt(item.statistics.viewCount, 10);
    }
  });

  return viewsData;
}

export function useYoutubeData() {
  const [views, setViews] = useState(globalCache || {});
  const [loading, setLoading] = useState(!globalCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have cached data, use it
    if (globalCache) {
      setViews(globalCache);
      setLoading(false);
      return;
    }

    // Subscribe to updates
    const handleUpdate = (data) => {
      setViews(data);
      setLoading(false);
      setError(null);
    };
    subscribers.add(handleUpdate);

    // If no one is currently fetching, start a fetch
    if (!isFetching) {
      isFetching = true;
      fetchYouTubeData()
        .then(data => {
          globalCache = data;
          notifySubscribers(data);
        })
        .catch(err => {
          console.error('Error fetching YouTube stats:', err);
          setError(err.message);
        })
        .finally(() => {
          isFetching = false;
          setLoading(false);
        });
    }

    // Cleanup subscription
    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  return { views, loading, error };
}
