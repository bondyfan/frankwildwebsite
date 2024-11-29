import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import staticViewsCache from '../data/viewsCache.json';

let memoryCache = null;
let lastFetchTime = null;

export function useYoutubeData() {
  const [views, setViews] = useState(staticViewsCache.views);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        // Use memory cache if it's less than 1 minute old
        if (memoryCache && lastFetchTime && (Date.now() - lastFetchTime) < 60000) {
          setViews(memoryCache);
          return;
        }

        // Try to fetch fresh data
        const response = await axios.get(`${API_URL}/api/youtube-stats`);
        memoryCache = response.data;
        lastFetchTime = Date.now();
        setViews(response.data);
      } catch (error) {
        console.error('Error fetching video stats:', error);
        // Keep using static cache if API fails
        if (Object.keys(views).length === 0) {
          setViews(staticViewsCache.views);
        }
      }
    };

    fetchViews();
  }, []);

  return views;
}
