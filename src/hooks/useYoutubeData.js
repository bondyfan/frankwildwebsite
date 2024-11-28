import { useState, useEffect } from 'react';
import axios from 'axios';

let viewsCache = null;
let lastFetchTime = null;

export const useYoutubeData = (videos) => {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const fetchViews = async () => {
      // If cache exists and is less than 1 minute old, use it
      if (viewsCache && lastFetchTime && (Date.now() - lastFetchTime) < 60000) {
        setVideoData(viewsCache);
        return;
      }

      try {
        const response = await axios.get('/api/youtube-stats');
        viewsCache = response.data;
        lastFetchTime = Date.now();
        setVideoData(response.data);
      } catch (error) {
        console.error('Error fetching video stats:', error);
        setVideoData({});
      }
    };

    fetchViews();
  }, []);

  return videoData;
};
