import { useState, useEffect } from 'react';
import axios from 'axios';
import { VIDEO_IDS, VIDEO_YEARS } from '../constants/constants';
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
    console.warn('YouTube API key is not configured, using fallback data');
    // Return fallback data with 0 views
    const fallbackData = {
      views: Object.keys(VIDEO_IDS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      uploadDates: VIDEO_YEARS
    };
    globalCache = fallbackData;
    notifySubscribers(fallbackData);
    return fallbackData;
  }

  const url = 'https://www.googleapis.com/youtube/v3/videos';
  const videoIds = Object.values(VIDEO_IDS).join(',');
  
  console.log('🎥 Fetching YouTube data...', {
    timestamp: new Date().toISOString(),
    videoIds
  });

  try {
    const response = await axios.get(url, {
      params: {
        part: 'statistics,snippet',
        id: videoIds,
        key: YOUTUBE_API_KEY
      }
    });

    console.log('✅ YouTube API response received', {
      timestamp: new Date().toISOString(),
      status: response.status,
      itemsCount: response?.data?.items?.length || 0
    });

    if (!response.data || !response.data.items) {
      throw new Error('Invalid response from YouTube API');
    }

    // Process the response
    const processedData = {
      views: {},
      uploadDates: {}
    };

    response.data.items.forEach(item => {
      const title = Object.keys(VIDEO_IDS).find(key => VIDEO_IDS[key] === item.id);
      if (title) {
        processedData.views[title] = parseInt(item.statistics.viewCount, 10);
        processedData.uploadDates[title] = VIDEO_YEARS[title];
      }
    });

    globalCache = processedData;
    notifySubscribers(processedData);
    return processedData;
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    // Return fallback data with 0 views on error
    const fallbackData = {
      views: Object.keys(VIDEO_IDS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      uploadDates: VIDEO_YEARS
    };
    globalCache = fallbackData;
    notifySubscribers(fallbackData);
    return fallbackData;
  }
}

export function useYoutubeData() {
  const [data, setData] = useState(globalCache || { views: {}, uploadDates: {} });
  const [loading, setLoading] = useState(!globalCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have cached data, use it
    if (globalCache) {
      setData(globalCache);
      setLoading(false);
      return;
    }

    // Subscribe to updates
    const handleUpdate = (newData) => {
      setData(newData);
      setLoading(false);
      setError(null);
    };
    subscribers.add(handleUpdate);

    // If no one is currently fetching, start a fetch
    if (!isFetching) {
      isFetching = true;
      fetchYouTubeData()
        .then(newData => {
          globalCache = newData;
          notifySubscribers(newData);
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

  return { 
    views: data.views, 
    uploadDates: data.uploadDates,
    loading, 
    error 
  };
}
