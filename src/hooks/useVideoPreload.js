import { useEffect } from 'react';

export function useVideoPreload(videoSrc, shouldPreload = true) {
  useEffect(() => {
    if (!shouldPreload || !videoSrc) return;

    const preloadVideo = document.createElement('video');
    preloadVideo.src = videoSrc;
    preloadVideo.preload = 'auto';
    preloadVideo.style.display = 'none';
    preloadVideo.muted = true;

    document.body.appendChild(preloadVideo);

    // Start loading the video
    preloadVideo.load();

    return () => {
      if (preloadVideo) {
        preloadVideo.remove();
      }
    };
  }, [videoSrc, shouldPreload]);
}
