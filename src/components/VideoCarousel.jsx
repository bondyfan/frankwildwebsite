import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoComponent from './VideoComponent';
import { useYoutubeData } from '../hooks/useYoutubeData';
import styles from './VideoCarousel.module.css';

// Debounce helper function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function VideoCarousel({ videos = [], onSlideChange, mobileBackgroundRef }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isClickable, setIsClickable] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('rgb(243, 244, 246)');
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isMobile] = useState(window.innerWidth <= 768);
  const carouselRef = useRef(null);
  const scrollingRef = useRef(false);
  const currentVideoRef = useRef(null);
  const lastSyncTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const { views: viewsData = {}, uploadDates = {} } = useYoutubeData() || {};

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to sync background video with carousel video
  const syncBackgroundVideo = useCallback(() => {
    if (isMobile && mobileBackgroundRef?.current && currentVideoRef.current) {
      const now = performance.now();
      const existingVideo = mobileBackgroundRef.current.querySelector('video');
      
      if (existingVideo && !existingVideo.paused && (now - lastSyncTimeRef.current > 50)) {
        const targetTime = currentVideoRef.current.currentTime + 0.05; // 50ms ahead
        const timeDiff = targetTime - existingVideo.currentTime;
        
        // If difference is too large, sync directly
        if (Math.abs(timeDiff) > 0.1) {
          existingVideo.currentTime = targetTime;
        } else {
          // Otherwise adjust playback rate for smooth sync
          const newRate = 1 + Math.sign(timeDiff) * Math.min(Math.abs(timeDiff) * 2, 0.1);
          existingVideo.playbackRate = newRate;
        }
        
        lastSyncTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(syncBackgroundVideo);
    }
  }, [isMobile, mobileBackgroundRef]);

  // Set up sync with requestAnimationFrame
  useEffect(() => {
    if (isMobile && mobileBackgroundRef?.current) {
      animationFrameRef.current = requestAnimationFrame(syncBackgroundVideo);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isMobile, mobileBackgroundRef, syncBackgroundVideo]);

  // Function to clone video for background
  const cloneVideoForBackground = (videoElement) => {
    if (isMobile && mobileBackgroundRef?.current && videoElement) {
      currentVideoRef.current = videoElement;
      let existingVideo = mobileBackgroundRef.current.querySelector('video');
      
      if (!existingVideo) {
        existingVideo = document.createElement('video');
        existingVideo.muted = true;
        existingVideo.loop = true;
        existingVideo.playsInline = true;
        existingVideo.autoplay = true;
        existingVideo.className = "w-full h-full object-cover transition-opacity duration-300";
        existingVideo.style.willChange = 'transform, opacity';
        mobileBackgroundRef.current.appendChild(existingVideo);
      }

      if (existingVideo.src !== videoElement.src) {
        // Fade out
        existingVideo.style.opacity = '0';
        
        // Wait for fade out, then change source
        setTimeout(() => {
          existingVideo.src = videoElement.src;
          existingVideo.currentTime = videoElement.currentTime;
          existingVideo.playbackRate = 1;
          existingVideo.play().then(() => {
            // Fade back in
            existingVideo.style.opacity = '1';
          }).catch(console.error);
        }, 300);
      }
    }
  };

  // Handle video visibility change
  const handleVideoVisibilityChange = (index, videoElement) => {
    if (index === visibleIndex) {
      cloneVideoForBackground(videoElement);
    }
  };

  const sortedVideos = useMemo(() => {
    if (!Array.isArray(videos)) return [];
    return [...videos].sort((a, b) => {
      if (a.title === "Hafo") return -1;
      if (b.title === "Hafo") return 1;
      if (a.title === "Vezmu Si Tě Do Pekla") return -1;
      if (b.title === "Vezmu Si Tě Do Pekla") return 1;
      return (viewsData[b.title] || 0) - (viewsData[a.title] || 0);
    });
  }, [videos, viewsData]);

  // Calculate which items should be rendered
  const visibleItems = useMemo(() => {
    if (isMobile) {
      const start = Math.max(0, visibleIndex - 1);
      const end = Math.min(sortedVideos.length, visibleIndex + 2);
      return sortedVideos.slice(start, end);
    }
    return [sortedVideos[currentIndex]];
  }, [isMobile, visibleIndex, currentIndex, sortedVideos]);

  const getItemStyle = useCallback((index) => {
    if (isMobile) {
      return {
        width: 'calc(75vw)',
        marginRight: 'calc(8vw)',
        padding: '0 calc(4vw)',
        transform: `translateX(${(index - visibleIndex) * 100}%)`
      };
    }
    return {};
  }, [isMobile, visibleIndex]);

  useEffect(() => {
    if (sortedVideos[currentIndex]) {
      onSlideChange(sortedVideos[currentIndex].title);
    }
  }, [currentIndex, sortedVideos, onSlideChange]);

  const handleColorExtracted = useCallback((color) => {
    setBackgroundColor(color);
  }, []);

  useEffect(() => {
    if (isMobile && carouselRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = parseInt(entry.target.dataset.index);
            if (!isNaN(index) && entry.intersectionRatio > 0.02) {
              setVisibleIndex(index);
              if (onSlideChange) {
                onSlideChange(index);
              }
            }
          });
        },
        {
          root: carouselRef.current,
          threshold: [0.02],
          rootMargin: '0px'
        }
      );

      const handleScroll = () => {
        if (!scrollingRef.current) {
          scrollingRef.current = true;
          requestAnimationFrame(() => {
            scrollingRef.current = false;
          });
        }
      };

      const container = carouselRef.current;
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      const items = container.querySelectorAll('.carousel-item');
      items.forEach((item) => observer.observe(item));

      return () => {
        container.removeEventListener('scroll', handleScroll);
        items.forEach((item) => observer.unobserve(item));
      };
    }
  }, [isMobile, onSlideChange]);

  if (sortedVideos.length === 0) return null;

  if (isMobile) {
    return (
      <div className="w-full">
        <div 
          ref={carouselRef}
          className={`flex overflow-x-auto overscroll-y-none snap-x snap-mandatory ${styles.scrollbarHide} mb-4 -mx-4 md:mx-0`}
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: "calc(50vw - 20vw)",
            paddingRight: "calc(50vw - 20vw)",
          }}
        >
          {sortedVideos.map((video, index) => {
            const isAdjacent = Math.abs(index - visibleIndex) <= 1;
            const shouldPlay = isMobile ? isAdjacent : index === visibleIndex;
            return (
              <div 
                key={index} 
                className="carousel-item flex-none snap-center transform transition-transform"
                data-index={index}
                style={{
                  width: 'calc(75vw)',
                  marginRight: 'calc(8vw)',
                  padding: '0 calc(4vw)'
                }}
              >
                <VideoComponent 
                  video={video}
                  onColorExtracted={handleColorExtracted}
                  isClickable={true}
                  isVisible={shouldPlay}
                  shouldPreload={isAdjacent}
                  onVideoRef={(videoElement) => handleVideoVisibilityChange(index, videoElement)}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 pb-4">
          {sortedVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const element = document.querySelector(`[data-index="${index}"]`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === visibleIndex 
                  ? "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500" 
                  : "bg-gray-900"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[95%] mx-auto">
      <div 
        className="relative w-full py-6 transition-colors duration-1000"
        style={{
          background: `linear-gradient(180deg, ${backgroundColor}33 0%, ${backgroundColor}11 100%)`,
        }}
      >
        <div className="flex justify-center items-center h-[400px] lg:h-[450px] relative">
          <div className="absolute inset-0 z-10 flex items-center justify-between w-full mx-auto -mt-24">
            <button
              style={{ transform: 'translateX(calc(-100% - 5vw))' }}
              className="w-14 sm:w-16 h-14 sm:h-16 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 border border-gray-100"
              onClick={() => {
                setDirection(-1);
                setTimeout(() => {
                  setCurrentIndex((prevIndex) => (prevIndex - 1 + sortedVideos.length) % sortedVideos.length);
                }, 0);
              }}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              style={{ transform: 'translateX(calc(100% + 5vw))' }}
              className="w-14 sm:w-16 h-14 sm:h-16 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 border border-gray-100"
              onClick={() => {
                setDirection(1);
                setTimeout(() => {
                  setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedVideos.length);
                }, 0);
              }}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentIndex}
              variants={{
                enterRight: { x: 300, opacity: 0 },
                enterLeft: { x: -300, opacity: 0 },
                center: { x: 0, opacity: 1 },
                exitRight: { x: 300, opacity: 0 },
                exitLeft: { x: -300, opacity: 0 }
              }}
              initial={direction > 0 ? "enterRight" : "enterLeft"}
              animate="center"
              exit={direction > 0 ? "exitLeft" : "exitRight"}
              transition={{
                x: { type: "spring", stiffness: 500, damping: 35 },
                opacity: { duration: 0.15 }
              }}
              className="absolute pointer-events-none"
            >
              <div className="pointer-events-auto">
                <VideoComponent 
                  video={sortedVideos[currentIndex]} 
                  onColorExtracted={handleColorExtracted}
                  isClickable={true}
                  isVisible={true}
                  shouldPlay={true}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-0 flex justify-center gap-2">
        {sortedVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const newDirection = index > currentIndex ? 1 : -1;
              setDirection(newDirection);
              setTimeout(() => {
                setCurrentIndex(index);
              }, 0);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex 
                ? "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 scale-125" 
                : "bg-gray-900"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default VideoCarousel;
