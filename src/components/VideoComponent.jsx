import React from 'react';
import { motion } from 'framer-motion';
import { formatViews } from '../utils/formatters';
import { useYoutubeData } from '../hooks/useYoutubeData';

function VideoComponent({ video, isClickable, isVisible = true }) {
  const { views, loading, error } = useYoutubeData();
  const videoId = video.videoId || (video.videoIds && video.videoIds[0]);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

  const getViewCount = (title) => {
    if (!views) return undefined;
    
    if (title === "Hafo") {
      // Combine views from both Hafo videos
      const mainViews = views["Hafo"] || 0;
      const alternateViews = views["Hafo (alternate)"] || 0;
      return mainViews + alternateViews;
    }
    
    return views[title];
  };

  const handleClick = () => {
    if (!isClickable) return;
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  if (!isVisible) return null;

  const viewCount = getViewCount(video.title);

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div onClick={handleClick} className={`cursor-pointer w-[75vw] md:w-[50vw] lg:w-[32vw] ${isClickable ? 'hover:opacity-90' : ''}`}>
        <div className="rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt={video.title}
                className={`absolute inset-0 w-full h-full object-cover ${video.title === "Hafo" ? "scale-110" : ""}`}
                loading="eager"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
        <div className="relative inline-block">
          <div className="relative px-6 py-3">
            {loading ? (
              <span className="text-lg font-semibold text-gray-500">Loading views...</span>
            ) : error ? (
              <span className="text-lg font-semibold text-red-500">{error}</span>
            ) : viewCount !== undefined ? (
              <>
                <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 drop-shadow-sm">
                  {formatViews(viewCount)}
                </span>
                <span className="relative z-10 ml-2 text-lg font-semibold text-gray-700">views</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-500">Views not available</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VideoComponent;
