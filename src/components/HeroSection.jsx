// Import necessary dependencies
import React, { useState, useEffect, useRef } from 'react';
import VideoCarousel from './VideoCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { videos } from '../constants/constants';
import { useVideoPreload } from '../hooks/useVideoPreload';
import { useYoutubeData } from '../hooks/useYoutubeData';
import { FaYoutube } from 'react-icons/fa';

// HeroSection component: displays a hero section with a video carousel
function HeroSection() {
  const [currentVideo, setCurrentVideo] = useState("Hafo");
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const youtubeData = useYoutubeData();
  const mobileBackgroundRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowSubscribers(prev => !prev);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const formatSubscriberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Desktop video map
  const videoMap = {
    "Vezmu Si Tě Do Pekla": "/carousel/optimized/VSTDP.mp4",
    "Hafo": "/carousel/optimized/hafo.mp4",
    "Bunny Hop": "/carousel/optimized/bunnyhop.mp4",
    "Upír Dex": "/carousel/optimized/upirdex.mp4",
    "HOT": "/carousel/optimized/hot.mp4",
    "Zabil Jsem Svou Holku": "/carousel/optimized/zabil.mp4"
  };

  const backgroundUrl = !isMobile ? videoMap[currentVideo] : null;
  const isVideo = backgroundUrl?.toLowerCase().endsWith('.mp4');

  useVideoPreload(Object.values(videoMap));

  const handleVideoChange = (video) => {
    setCurrentVideo(video);
  };

  return (
    <motion.section 
      id="home" 
      className="md:min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-neutral-50 px-4 sm:px-8 md:px-12 pt-safe md:pt-16 pb-1 md:pb-12 relative overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Desktop background */}
      {!isMobile && (
        <AnimatePresence initial={false}>
          {backgroundUrl && (
            <motion.div 
              key={backgroundUrl}
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              {isVideo ? (
                <video
                  src={backgroundUrl}
                  className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm opacity-40"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  style={{
                    willChange: 'opacity',
                  }}
                />
              ) : (
                <motion.div 
                  key={backgroundUrl}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={backgroundUrl}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm opacity-40"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile background video wrapper */}
      {isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            ref={mobileBackgroundRef}
            className="absolute inset-0 w-full h-full"
            style={{
              willChange: 'transform',
              transform: 'scale(1.05)',
              filter: 'blur(8px)',
              opacity: 0.4
            }}
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgb(250 250 250) 100%)',
          zIndex: 1
        }}
      />

      {/* Content container */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            {/* Title */}
            <motion.h1 
              className="mt-8 sm:mt-24 text-6xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl mb-8 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <span className="block">
                Frank Wild
              </span>
            </motion.h1>
            
            {/* Alternating subtitle */}
            <div className="h-12 relative mb-8 w-full">
              <AnimatePresence mode="wait">
                {!showSubscribers ? (
                  <motion.h2
                    key="subheading"
                    className="text-xl sm:text-2xl h-12 md:text-2xl absolute w-full text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    Hudební videa, která trhají rekordy
                  </motion.h2>
                ) : (
                  <motion.div
                    key="subscribers"
                    className="flex h-12 items-center justify-center gap-2 text-xl sm:text-2xl md:text-2xl absolute w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaYoutube className="text-red-600 text-2xl" />
                    <span className="font-bold">{formatSubscriberCount(youtubeData.subscriberCount)} odběratelů</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Video carousel */}
            <motion.div 
              className="w-full max-w-lg mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <VideoCarousel 
                videos={videos}
                onSlideChange={handleVideoChange}
                mobileBackgroundRef={isMobile ? mobileBackgroundRef : null}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
