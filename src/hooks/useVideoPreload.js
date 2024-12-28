import { useEffect } from 'react';

export function useVideoPreload(videoSrc, shouldPreload = true) {
  useEffect(() => {
    if (!shouldPreload) return;

    let videos = [];
    
    // Handle both single video and video map cases
    if (typeof videoSrc === 'string') {
      videos.push(videoSrc);
    } else if (typeof videoSrc === 'object') {
      videos = Object.values(videoSrc);
    }

    const preloadElements = videos.map(src => {
      if (!src) return null;

      const preloadVideo = document.createElement('video');
      preloadVideo.src = src;
      preloadVideo.preload = 'auto';
      preloadVideo.style.display = 'none';
      preloadVideo.muted = true;

      document.body.appendChild(preloadVideo);
      preloadVideo.load();

      return preloadVideo;
    }).filter(Boolean);

    return () => {
      preloadElements.forEach(video => {
        if (video) {
          video.remove();
        }
      });
    };
  }, [videoSrc, shouldPreload]);
}
