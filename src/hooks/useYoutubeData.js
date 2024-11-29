import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

let viewsCache = null;
let lastFetchTime = null;

export function useYoutubeData() {
  const [views, setViews] = useState({});

  useEffect(() => {
    const fetchViews = async () => {
      console.log('Attempting to fetch views from:', `${API_URL}/api/youtube-stats`);
      try {
        if (viewsCache && lastFetchTime && (Date.now() - lastFetchTime) < 60000) {
          console.log('Using cached views:', viewsCache);
          setViews(viewsCache);
          return;
        }

        console.log('Making API request to:', `${API_URL}/api/youtube-stats`);
        const response = await axios.get(`${API_URL}/api/youtube-stats`);
        console.log('Received response:', response.data);
        viewsCache = response.data;
        lastFetchTime = Date.now();
        setViews(response.data);
      } catch (error) {
        console.error('Error fetching video stats:', error);
        console.error('API_URL:', API_URL);
        setViews({});
      }
    };

    fetchViews();
  }, []);

  return views;
}
