// Import necessary dependencies
import React, { useState } from 'react';
import VideoCarousel from './VideoCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { videos } from '../constants/constants';

// HeroSection component: displays a hero section with a video carousel
function HeroSection() {
  // State to track the currently selected video, defaults to "Hafo"
  const [currentVideo, setCurrentVideo] = useState("Hafo");

  // Find the current video object to get its video ID
  const activeVideo = videos.find(video => video.title === currentVideo);
  const videoId = activeVideo?.videoIds ? activeVideo.videoIds[0] : activeVideo?.videoId;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    // Main section container with animation
    <motion.section 
      id="home" 
      className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 sm:px-8 md:px-12 pt-safe md:pt-16 pb-1 md:pb-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Blurred background thumbnail */}
      <AnimatePresence initial={false}>
        {thumbnailUrl && (
          <motion.div 
            key={thumbnailUrl}
            className="absolute inset-0 -inset-x-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              filter: 'blur(24px)',
              transform: 'scale(1.2)',
              willChange: 'opacity',
            }}
          />
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
      <div className="relative z-10">
        {/* Text content container with responsive padding and margins */}
        <div className="text-center mb-8 sm:mb-0 md:mb-0 px-4 sm:px-8 md:px-12">
          {/* Main heading with responsive font sizes and spacing */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter pt-16 sm:pt-20 mb-6 sm:mb-8">Frank Wild</h1>
          {/* Subheading with responsive sizing and max-width for better readability */}
          <h2 className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-[80%] mx-auto">Hudební videa, která trhají rekordy</h2>
        </div>
        {/* Video carousel container with max-width and centering */}
        <div className="w-full max-w-lg mx-auto">
          {/* Render VideoCarousel component with videos data and onSlideChange callback */}
          <VideoCarousel videos={videos} onSlideChange={setCurrentVideo} />
        </div>
      </div>
    </motion.section>
  );
}

// Export HeroSection component as default
export default HeroSection;
