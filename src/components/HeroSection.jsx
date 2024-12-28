// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import VideoCarousel from './VideoCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { videos } from '../constants/constants';
import { useVideoPreload } from '../hooks/useVideoPreload';

// HeroSection component: displays a hero section with a video carousel
function HeroSection() {
  // State to track the currently selected video, defaults to the first video title
  const [currentVideo, setCurrentVideo] = useState(videos[0].title);
  // State to track whether the video is loaded
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
  
  // YouTube thumbnail fallback
  const youtubeThumb = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  // Background URL, prioritizing video map and falling back to YouTube thumbnail
  const backgroundUrl = videoMap[currentVideo] || youtubeThumb;
  // Check if the background URL is a video
  const isVideo = backgroundUrl?.toLowerCase().endsWith('.mp4');

  useVideoPreload(videoMap);

  // Handle video load event
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Handle video error event
  const handleVideoError = () => {
    setIsVideoLoaded(false);
  };

  // Reset video loaded state when the current video changes
  useEffect(() => {
    setIsVideoLoaded(false);
  }, [currentVideo]);

  return (
    // Main section container with animation
    <motion.section 
      id="home" 
      className="md:min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-neutral-50 px-4 sm:px-8 md:px-12 pt-safe md:pt-16 pb-1 md:pb-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background video/image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {!isVideoLoaded && youtubeThumb && (
          <img
            src={youtubeThumb}
            alt={currentVideo}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(5px)' }}
          />
        )}
        {isVideo ? (
          <video
            key={backgroundUrl}
            src={backgroundUrl}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          />
        ) : (
          <img
            src={backgroundUrl}
            alt={currentVideo}
            className="w-full h-full object-cover"
          />
        )}
      </div>
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
          <h1 className="text-6xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter pt-16 sm:pt-20 mb-4 sm:mb-8">Frank Wild</h1>
          {/* Subheading with responsive sizing and max-width for better readability */}
          <h2 className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-[80%] mx-auto pb-8 md:pb-0">Hudební videa, která trhají rekordy</h2>
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
