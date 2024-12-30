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
      uploadDates: VIDEO_YEARS,
      subscriberCount: 0
    };
    globalCache = fallbackData;
    notifySubscribers(fallbackData);
    return fallbackData;
  }

  const videoUrl = 'https://www.googleapis.com/youtube/v3/videos';
  const channelUrl = 'https://www.googleapis.com/youtube/v3/channels';
  const videoIds = Object.values(VIDEO_IDS).join(',');
  const channelId = 'UCKhUFfotWYK1_PCRZ_0e3fQ';
  
  console.log('🎥 Fetching YouTube data...', {
    timestamp: new Date().toISOString(),
    videoIds
  });

  try {
    const [videoResponse, channelResponse] = await Promise.all([
      axios.get(videoUrl, {
        params: {
          part: 'statistics,snippet',
          id: videoIds,
          key: YOUTUBE_API_KEY
        }
      }),
      axios.get(channelUrl, {
        params: {
          part: 'statistics',
          id: channelId,
          key: YOUTUBE_API_KEY
        }
      })
    ]);

    console.log('✅ YouTube API response received', {
      timestamp: new Date().toISOString(),
      status: videoResponse.status,
      itemsCount: videoResponse?.data?.items?.length || 0
    });

    if (!videoResponse.data || !videoResponse.data.items) {
      throw new Error('Invalid response from YouTube API');
    }

    const views = {};
    const uploadDates = {};

    videoResponse.data.items.forEach(item => {
      const viewCount = parseInt(item.statistics.viewCount, 10);
      const uploadDate = new Date(item.snippet.publishedAt).getFullYear();
      
      // Find the video key by its ID
      const videoKey = Object.entries(VIDEO_IDS).find(([_, id]) => id === item.id)?.[0];
      if (videoKey) {
        views[videoKey] = viewCount;
        uploadDates[videoKey] = uploadDate;
      }
    });

    const subscriberCount = parseInt(channelResponse.data?.items?.[0]?.statistics?.subscriberCount || '0', 10);

    const data = {
      views,
      uploadDates,
      subscriberCount
    };

    globalCache = data;
    notifySubscribers(data);
    return data;
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    throw error;
  }
}

function useYoutubeData() {
  const [data, setData] = useState(globalCache);

  useEffect(() => {
    // If we already have cached data, use it immediately
    if (globalCache) {
      setData(globalCache);
      return;
    }

    // Subscribe to updates
    subscribers.add(setData);

    // If no one is currently fetching, start a fetch
    if (!isFetching) {
      isFetching = true;
      fetchYouTubeData()
        .catch(console.error)
        .finally(() => {
          isFetching = false;
        });
    }

    // Cleanup subscription
    return () => {
      subscribers.delete(setData);
    };
  }, []);

  return data || { views: {}, uploadDates: {}, subscriberCount: 0 };
}

export { useYoutubeData };
