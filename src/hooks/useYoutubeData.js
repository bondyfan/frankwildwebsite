import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import staticViewsCache from '../data/viewsCache.json';

const LOCAL_STORAGE_KEY = 'frankwild_views_cache';

export function useYoutubeData() {
  const [views, setViews] = useState(() => {
    // Always start with static cache for immediate display
    console.log('Using static cache:', staticViewsCache.views);
    return staticViewsCache.views;
  });

  useEffect(() => {
    // Try to get localStorage data
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const staticTimestamp = new Date(staticViewsCache.lastUpdated).getTime();
        
        // Use localStorage data if it's newer than static cache
        if (timestamp > staticTimestamp) {
          console.log('Using newer localStorage cache');
          setViews(data);
        }
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
    }

    // Try API in the background
    const fetchViews = async () => {
      try {
        console.log('Fetching fresh data from API');
        const response = await axios.get(`${API_URL}/api/youtube-stats`);
        
        // Normalize the response data to match our cache format
        const normalizedData = {};
        if (response.data && typeof response.data === 'object') {
          // If response.data is already in the right format (id -> views)
          if (Object.values(response.data).every(v => typeof v === 'number')) {
            normalizedData = response.data;
          } 
          // If response.data has a different structure, try to normalize it
          else {
            Object.entries(response.data).forEach(([key, value]) => {
              // Handle different possible response formats
              if (typeof value === 'number') {
                normalizedData[key] = value;
              } else if (value && typeof value.viewCount === 'number') {
                normalizedData[key] = value.viewCount;
              } else if (value && typeof value.views === 'number') {
                normalizedData[key] = value.views;
              }
            });
          }
        }
        
        // Only update if we got valid data
        if (Object.keys(normalizedData).length > 0) {
          // Save to localStorage with timestamp
          const newCache = {
            data: normalizedData,
            timestamp: Date.now()
          };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCache));
          
          // Update state
          setViews(normalizedData);
          console.log('Updated views with API data:', normalizedData);
        } else {
          console.warn('Invalid API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching video stats:', error);
        // Keep showing static cache data
      }
    };

    fetchViews();
  }, []); // Run once on mount

  return views;
}
