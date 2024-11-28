import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../constants/constants';

function MediaCard({ post, isDesktop }) {
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${isDesktop ? 'w-full' : 'flex-none w-[85%]'} px-4 snap-center`}
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gradient-to-br from-teal-400 via-teal-500 to-amber-200 rounded-[32px] shadow-lg overflow-hidden h-full transform transition-transform duration-300">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
        </div>
        <div className="p-5">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-2">
            {post.source}
          </span>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-2">{post.excerpt}</p>
        </div>
      </div>
    </motion.a>
  );
}

function DesktopNavButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 
        bg-white/80 backdrop-blur-sm hover:bg-white/90
        w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200
        ${direction === 'next' ? '-right-20' : '-left-20'}`}
    >
      <svg
        className={`w-6 h-6 ${direction === 'next' ? '' : 'rotate-180'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

export default function MediaSection() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentIndex(1);
  };

  const prevSlide = () => {
    setCurrentIndex(0);
  };

  return (
    <motion.section
      className="py-12 sm:py-20 bg-neutral-50 w-screen overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
        V médiích
      </h2>
      
      {isMobile ? (
        // Mobile scrolling view
        <div className="relative w-full">
          <div
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-[7.5%]"
            style={{
              paddingLeft: "7.5%",
              paddingRight: "7.5%",
            }}
          >
            {blogPosts.map((post, index) => (
              <MediaCard key={index} post={post} isDesktop={false} />
            ))}
          </div>
        </div>
      ) : (
        // Desktop grid view with pagination
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative">
            {/* Container that shows exactly 3 items */}
            <div className="w-full overflow-hidden" ref={containerRef}>
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  width: 'calc(100% / 3 * 4)', // Width for 4 items
                  transform: `translateX(calc(-${currentIndex} * (100% / 4)))`, // Move by 1/4 of total width
                  gap: '2rem',
                }}
              >
                {/* Show 4 items so we can slide to the next one */}
                {[...blogPosts.slice(0, 4)].map((post, index) => (
                  <div 
                    key={index} 
                    style={{
                      width: `calc((100% - 6rem) / 4)`, // Total width minus 3 gaps (2rem each), divided by 4
                      flexShrink: 0,
                    }}
                  >
                    <MediaCard post={post} isDesktop={true} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            {currentIndex === 0 && (
              <DesktopNavButton
                direction="next"
                onClick={nextSlide}
              />
            )}
            {currentIndex === 1 && (
              <DesktopNavButton
                direction="prev"
                onClick={prevSlide}
              />
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
}