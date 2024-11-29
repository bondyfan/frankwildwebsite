import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import staticViewsCache from '../data/viewsCache.json';

const LOCAL_STORAGE_KEY = 'frankwild_views_cache';

export function useYoutubeData() {
  const [views, setViews] = useState(() => {
    // Try to get localStorage data on initial render
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const staticTimestamp = new Date(staticViewsCache.lastUpdated).getTime();
        
        // Use localStorage data if it's newer than static cache
        if (timestamp > staticTimestamp) {
          console.log('Using newer localStorage cache');
          return data;
        }
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
    }
    
    // Fall back to static cache
    console.log('Using static cache');
    return staticViewsCache.views;
  });

  useEffect(() => {
    const fetchViews = async () => {
      try {
        console.log('Fetching fresh data from API');
        const response = await axios.get(`${API_URL}/api/youtube-stats`);
        
        // Save to localStorage with timestamp
        const newCache = {
          data: response.data,
          timestamp: Date.now()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCache));
        
        // Update state
        setViews(response.data);
        
      } catch (error) {
        console.warn('Error fetching video stats:', error);
        // Keep current views (either from localStorage or static cache)
      }
    };

    fetchViews();
  }, []);

  return views;
}
