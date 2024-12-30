// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import VideoCarousel from './VideoCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { videos } from '../constants/constants';
import { useVideoPreload } from '../hooks/useVideoPreload';
import { useYoutubeData } from '../hooks/useYoutubeData';
import { FaYoutube } from 'react-icons/fa';

// HeroSection component: displays a hero section with a video carousel
function HeroSection() {
  // State to track the currently selected video, defaults to "Hafo"
  const [currentVideo, setCurrentVideo] = useState("Hafo");
  const [showSubscribers, setShowSubscribers] = useState(false);
  const youtubeData = useYoutubeData();

  useEffect(() => {
    const timer = setInterval(() => {
      setShowSubscribers(prev => !prev);
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(timer);
  }, []);

  // Find the current video object to get its video ID
  const activeVideo = videos.find(video => video.title === currentVideo);
  const videoId = activeVideo?.videoIds ? activeVideo.videoIds[0] : activeVideo?.videoId;
  const videoMap = {
    "Vezmu Si Tě Do Pekla": "/carousel/optimized/VSTDP.mp4",
    "Hafo": "/carousel/optimized/hafo.mp4",
    "Bunny Hop": "/carousel/optimized/bunnyhop.mp4",
    "Upír Dex": "/carousel/optimized/upirdex.mp4",
    "HOT": "/carousel/optimized/hot.mp4",
    "Zabil Jsem Svou Holku": "/carousel/optimized/zabil.mp4"
  };
  const backgroundUrl = videoMap[currentVideo] || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);
  const isVideo = backgroundUrl?.toLowerCase().endsWith('.mp4');

  useVideoPreload(videoMap);

  const formatSubscriberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    // Main section container with animation
    <motion.section 
      id="home" 
      className="md:min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-neutral-50 px-4 sm:px-8 md:px-12 pt-safe md:pt-16 pb-1 md:pb-12 relative overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* YouTube Subscriber Count */}
      {/* <a
        href="https://www.youtube.com/@frankwildofficial"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-28 right-8 z-50 bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-900 transition-colors duration-200"
      >
        <FaYoutube className="text-red-600 text-2xl" />
        <span className="font-bold">{formatSubscriberCount(youtubeData.subscriberCount)}</span>
      </a> */}

      {/* Blurred background */}
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
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundImage: `url(${backgroundUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  filter: 'blur(24px)',
                  transform: 'scale(1.2)',
                  willChange: 'opacity',
                  opacity: 0.5
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgb(250 250 250) 100%)',
          zIndex: 1
        }}
      />
      {/* Content container with relative positioning to appear above the background */}
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
            {/* Text content container with responsive padding and margins */}
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
            
            {/* Alternating content container */}
            <div className="h-12 relative mb-8 w-full overflow-x-hidden">
              <AnimatePresence mode="wait">
                {!showSubscribers ? (
                  <motion.h2
                    key="subheading"
                    className="text-xl sm:text-2xl md:text-2xl absolute w-full text-center"
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
            {/* Video carousel container with max-width and centering */}
            <motion.div 
              className="w-full max-w-lg mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              {/* Render VideoCarousel component with videos data and onSlideChange callback */}
              <VideoCarousel videos={videos} onSlideChange={setCurrentVideo} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

// Export HeroSection component as default
export default HeroSection;
