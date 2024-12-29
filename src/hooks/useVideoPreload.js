import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export function useVideoPreload(video) {
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await fetch(`${API_URL}/video/${encodeURIComponent(video.title)}`);
        if (!response.ok) throw new Error('Failed to fetch video');
        const data = await response.json();
        
        // Create a temporary video element to check if the browser can play the video
        const tempVideo = document.createElement('video');
        tempVideo.muted = true;
        tempVideo.src = data.url;
        
        // Wait for metadata to load to ensure the video is playable
        await new Promise((resolve, reject) => {
          tempVideo.onloadedmetadata = resolve;
          tempVideo.onerror = reject;
          // Set a timeout to avoid hanging
          setTimeout(reject, 5000);
        });

        setThumbnailUrl(data.url);
      } catch (error) {
        console.error('Error loading video:', error);
        setThumbnailUrl('');
      }
    };

    if (video?.title) {
      loadVideo();
    }

    return () => {
      setThumbnailUrl('');
    };
  }, [video]);

  return thumbnailUrl;
}
