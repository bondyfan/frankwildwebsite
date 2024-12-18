import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ColorThief from 'colorthief';
import { motion, AnimatePresence } from 'framer-motion';
import { formatViews } from '../utils/formatters';
import { useYoutubeData } from '../hooks/useYoutubeData';
import { API_URL } from '../config';

function VideoComponent({ video, onColorExtracted, isClickable, isVisible = true }) {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const viewsData = useYoutubeData();
  const views = video.id ? viewsData[video.id] : undefined;

  useEffect(() => {
    const videoId = video.videoId || (video.videoIds && video.videoIds[0]);
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }
  }, [video]);

  const handleClick = () => {
    if (!isClickable) return;
    
    const videoId = video.videoId || (video.videoIds && video.videoIds[0]);
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  useEffect(() => {
    if (thumbnailLoaded && onColorExtracted) {
      const img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.src = thumbnailUrl;
      
      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const color = colorThief.getColor(img);
          onColorExtracted(color);
        } catch (error) {
          console.error('Error extracting color:', error);
        }
      };
    }
  }, [thumbnailLoaded, thumbnailUrl, onColorExtracted]);

  return (
    <motion.div
      className="flex flex-col items-center"
    >
      <div onClick={handleClick} className={`cursor-pointer w-[75vw] md:w-[50vw] lg:w-[32vw] ${isClickable ? 'hover:opacity-90' : ''}`}>
        <div className="rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt={video.title}
                className={`absolute inset-0 w-full h-full object-cover ${video.title === "Hafo" ? "scale-110" : ""}`}
                onLoad={() => setThumbnailLoaded(true)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
        <div className="relative inline-block">
          <div className="relative px-6 py-3">
            <span className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 drop-shadow-sm ${views === undefined ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
              {formatViews(views)}
            </span>
            <span className="relative z-10 ml-2 text-lg font-semibold text-gray-700">views</span>
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
