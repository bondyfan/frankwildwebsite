import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import ColorThief from 'colorthief';
import { motion, AnimatePresence } from 'framer-motion';
import { formatViews } from '../utils/formatters';
import { useYoutubeData } from '../hooks/useYoutubeData';
import { useVideoPreload } from '../hooks/useVideoPreload';
import { API_URL } from '../config';

function VideoComponent({ video, onColorExtracted, isClickable = true, isVisible = true, shouldPlay = true }) {
  const [isMobile] = useState(window.innerWidth <= 768);
  const videoRef = useRef(null);
  const { views: viewsData = {} } = useYoutubeData() || {};

  // Video mappings for desktop and mobile
  const videoMap = useMemo(() => ({
    desktop: {
      "Vezmu Si Tě Do Pekla": "/carousel/optimized/VSTDP.mp4",
      "Hafo": "/carousel/optimized/hafo.mp4",
      "Bunny Hop": "/carousel/optimized/bunnyhop.mp4",
      "Upír Dex": "/carousel/optimized/upirdex.mp4",
      "HOT": "/carousel/optimized/hot.mp4",
      "Zabil Jsem Svou Holku": "/carousel/optimized/zabil.mp4"
    },
    mobile: {
      "Vezmu Si Tě Do Pekla": "/carousel/mobile/VSTDP.mp4",
      "Hafo": "/carousel/mobile/hafo.mp4",
      "Bunny Hop": "/carousel/mobile/bunnyhop.mp4",
      "Upír Dex": "/carousel/mobile/upirdex.mp4",
      "HOT": "/carousel/mobile/hot.mp4",
      "Zabil Jsem Svou Holku": "/carousel/mobile/zabil.mp4"
    }
  }), []);

  // Extract color when video is loaded
  useEffect(() => {
    if (videoRef.current && onColorExtracted) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const handleLoadedData = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const colorThief = new ColorThief();
        try {
          const color = colorThief.getColor(canvas);
          onColorExtracted(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        } catch (error) {
          console.error('Error extracting color:', error);
        }
      };

      video.addEventListener('loadeddata', handleLoadedData);
      return () => video.removeEventListener('loadeddata', handleLoadedData);
    }
  }, [onColorExtracted]);

  const handleClick = () => {
    if (!isClickable) return;
    
    const videoId = video.videoId || (video.videoIds && video.videoIds[0]);
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  const videoUrl = isMobile ? videoMap.mobile[video.title] : videoMap.desktop[video.title];

  return (
    <motion.div className="flex flex-col items-center">
      <div onClick={handleClick} className={`cursor-pointer w-[75vw] md:w-[50vw] lg:w-[32vw] ${isClickable ? 'hover:opacity-90' : ''}`}>
        <div className="rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${video.title === "Hafo" ? "scale-110" : ""}`}
              src={videoUrl}
              autoPlay={shouldPlay && isVisible}
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VideoComponent;
