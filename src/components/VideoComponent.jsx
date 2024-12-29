import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import ColorThief from 'colorthief';
import { motion, AnimatePresence } from 'framer-motion';
import { formatViews } from '../utils/formatters';
import { useYoutubeData } from '../hooks/useYoutubeData';
import { useVideoPreload } from '../hooks/useVideoPreload';
import { API_URL } from '../config';

function VideoComponent({ video, onColorExtracted, isClickable = true, isVisible = true, shouldPlay = true }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

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

  const views = video.title ? (
    video.title === "Hafo" 
      ? ((viewsData?.["Hafo"] || 0) + (viewsData?.["Hafo (alternate)"] || 0))
      : (viewsData?.[video.title] || 0)
  ) : undefined;

  const youtubeThumbUrl = video.videoIds 
    ? `https://img.youtube.com/vi/${video.videoIds[0]}/maxresdefault.jpg`
    : video.videoId 
      ? `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
      : null;

  return (
    <motion.div className="flex flex-col items-center">
      <div onClick={handleClick} className={`cursor-pointer w-[75vw] md:w-[50vw] lg:w-[32vw] ${isClickable ? 'hover:opacity-90' : ''}`}>
        <div className="rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${video.title === "Hafo" ? "scale-110" : ""}`}
              src={videoUrl}
              autoPlay={shouldPlay && isVisible}
              loop
              muted
              playsInline
              preload="auto"
              style={{
                transform: video.title === "Hafo" ? 'scale(1.1)' : 'none',
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {video.title}
        </h2>
        <div className="relative inline-block">
          <div className="relative px-6 py-3">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-red-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 drop-shadow-sm ${views === undefined ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
                {formatViews(views)}
              </span>
              <span className="relative z-10 ml-2 text-lg font-semibold text-gray-700">views</span>
            </div>
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.svg
                  key={`border-${video.title}`}
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 80"
                  preserveAspectRatio="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <defs>
                    <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <motion.rect
                    x="2"
                    y="2"
                    width="196"
                    height="76"
                    fill="none"
                    stroke="url(#border-gradient)"
                    strokeWidth="4"
                    rx="20"
                    ry="20"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill="white"
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 1, 0],
                      translateX: [0, 200, 200, 0, 0],
                      translateY: [0, 0, 80, 80, 0],
                      scale: [0.5, 1, 1, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.5, 0.75, 1],
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VideoComponent;
