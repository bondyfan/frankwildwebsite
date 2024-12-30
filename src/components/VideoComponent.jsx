import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ColorThief from 'colorthief';
import { motion, AnimatePresence } from 'framer-motion';
import { formatViews } from '../utils/formatters';
import { useYoutubeData } from '../hooks/useYoutubeData';
import { useVideoPreload } from '../hooks/useVideoPreload';
import { API_URL } from '../config';

function VideoComponent({ video, onColorExtracted, isClickable = true, isVisible = true, shouldPlay = true }) {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [firstFrame, setFirstFrame] = useState('');
  const [bgVideoReady, setBgVideoReady] = useState(false);
  const mainVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const { views: viewsData = {}, uploadDates = {} } = useYoutubeData() || {};
  const views = video.title ? (
    video.title === "Hafo" 
      ? ((viewsData?.["Hafo"] || 0) + (viewsData?.["Hafo (alternate)"] || 0))
      : (viewsData?.[video.title] || 0)
  ) : undefined;

  useEffect(() => {
    const videoId = video.videoId || (video.videoIds && video.videoIds[0]);
    if (videoId) {
      // Map video titles to their corresponding MP4 files
      const videoMap = {
        "Vezmu Si Tě Do Pekla": "/carousel/optimized/VSTDP.mp4",
        "Hafo": "/carousel/optimized/hafo.mp4",
        "Bunny Hop": "/carousel/optimized/bunnyhop.mp4",
        "Upír Dex": "/carousel/optimized/upirdex.mp4",
        "HOT": "/carousel/optimized/hot.mp4",
        "Zabil Jsem Svou Holku": "/carousel/optimized/zabil.mp4"
      };
      
      // Use MP4 if available, otherwise fallback to YouTube thumbnail
      const mp4Url = videoMap[video.title];
      if (mp4Url) {
        setVideoError(false);
        setThumbnailUrl(mp4Url);
        setThumbnailLoaded(true);
      } else {
        const url = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setThumbnailUrl(url);
        // Create a hidden image to trigger onLoad immediately if cached
        const img = new Image();
        img.onload = () => setThumbnailLoaded(true);
        img.src = url;
      }
    }
  }, [video]);

  useVideoPreload(thumbnailUrl, isVisible);

  useEffect(() => {
    if (thumbnailUrl && thumbnailUrl.toLowerCase().endsWith('.mp4')) {
      const tempVideo = document.createElement('video');
      tempVideo.src = thumbnailUrl;
      tempVideo.muted = true;
      tempVideo.preload = 'auto';

      tempVideo.addEventListener('loadeddata', () => {
        // Create canvas if it doesn't exist
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        
        // Set canvas size to video size
        canvasRef.current.width = tempVideo.videoWidth;
        canvasRef.current.height = tempVideo.videoHeight;
        
        // Draw the first frame
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(tempVideo, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Convert to data URL
        const frameDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
        setFirstFrame(frameDataUrl);
        
        // Clean up
        tempVideo.remove();
      }, { once: true });

      // Start loading the video
      tempVideo.load();

      return () => {
        tempVideo.remove();
      };
    }
  }, [thumbnailUrl]);

  const handleClick = () => {
    if (!isClickable) return;
    
    const videoId = video.videoId || (video.videoIds && video.videoIds[0]);
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  useEffect(() => {
    if (thumbnailLoaded && thumbnailUrl && !thumbnailUrl.endsWith('.mp4') && onColorExtracted) {
      const img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.src = thumbnailUrl;
      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const color = colorThief.getColor(img);
          onColorExtracted(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        } catch (error) {
          console.error('Error extracting color:', error);
        }
      };
    }
  }, [thumbnailLoaded, thumbnailUrl, onColorExtracted]);

  useEffect(() => {
    if (bgVideoRef.current) {
      const isMobile = window.innerWidth < 640;
      if (isMobile || shouldPlay) {
        bgVideoRef.current.play().catch(console.error);
      } else {
        bgVideoRef.current.pause();
        bgVideoRef.current.currentTime = 0;
      }
    }
  }, [shouldPlay]);

  const youtubeThumbUrl = video.videoIds 
    ? `https://img.youtube.com/vi/${video.videoIds[0]}/maxresdefault.jpg`
    : video.videoId 
      ? `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
      : null;

  return (
    <motion.div
      className="flex flex-col items-center"
    >
      <div onClick={handleClick} className={`cursor-pointer w-[75vw] md:w-[50vw] lg:w-[32vw] ${isClickable ? 'hover:opacity-90' : ''}`}>
        <div className="rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            {thumbnailUrl && thumbnailUrl.toLowerCase().endsWith('.mp4') && firstFrame && (
              <>
                {/* Always show thumbnail as background */}
                <img 
                  src={firstFrame}
                  alt={video.title}
                  className={`absolute inset-0 w-full h-full object-cover ${video.title === "Hafo" ? "scale-110" : ""}`}
                  style={{
                    zIndex: 1,
                    transform: video.title === "Hafo" ? 'scale(1.1)' : 'none',
                  }}
                />
                
                {/* Animate video on top */}
                <AnimatePresence>
                  {isVisible && (
                    <motion.video
                      key="video"
                      ref={bgVideoRef}
                      src={thumbnailUrl}
                      className={`absolute inset-0 w-full h-full object-cover ${video.title === "Hafo" ? "scale-110" : ""}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        zIndex: 2,
                        transform: video.title === "Hafo" ? 'scale(1.1)' : 'none',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        perspective: 1000,
                        WebkitPerspective: 1000,
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d'
                      }}
                      onLoadedData={() => {
                        setThumbnailLoaded(true);
                        setVideoError(false);
                        if (bgVideoRef.current) {
                          bgVideoRef.current.playbackRate = 1.0;
                        }
                      }}
                      onError={(e) => {
                        console.error('Video loading error:', e);
                        setVideoError(true);
                      }}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
            {thumbnailUrl && !thumbnailUrl.toLowerCase().endsWith('.mp4') && (
              <img 
                src={thumbnailUrl} 
                alt={video.title}
                className={`absolute inset-0 w-full h-full object-cover ${video.title === "Hafo" ? "scale-110" : ""}`}
                onLoad={() => setThumbnailLoaded(true)}
                loading="lazy"
              />
            )}
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
