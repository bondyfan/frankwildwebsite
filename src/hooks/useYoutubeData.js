import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

let viewsCache = null;
let lastFetchTime = null;

export function useYoutubeData() {
  const [views, setViews] = useState({});

  useEffect(() => {
    const fetchViews = async () => {
      try {
        if (viewsCache && lastFetchTime && (Date.now() - lastFetchTime) < 60000) {
          setViews(viewsCache);
          return;
        }

        const response = await axios.get(`${API_URL}/api/youtube-stats`);
        viewsCache = response.data;
        lastFetchTime = Date.now();
        setViews(response.data);
      } catch (error) {
        console.error('Error fetching video stats:', error);
        setViews({});
      }
    };

    fetchViews();
  }, []);

  return views;
}
