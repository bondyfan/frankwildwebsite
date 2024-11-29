import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FlashEffect = ({ delay, top, left, scale = 1 }) => (
  <div 
    className="absolute w-6 h-6 opacity-0"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      animation: `flash 1.5s ease-out ${delay}s infinite`,
      transform: `scale(${scale})`,
    }}
  >
    {/* Outer glow */}
    <div className="absolute inset-0 bg-white/30 blur-xl scale-150" />
    
    {/* Middle glow */}
    <div className="absolute inset-0 bg-white/50 blur-lg scale-125" />
    
    {/* Inner bright flash */}
    <div className="absolute inset-0 bg-white blur-[2px]" />

    {/* Star overlay */}
    <div 
      className="absolute inset-0 bg-white mix-blend-screen"
      style={{
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        transform: 'scale(0.7)',
      }}
    />
  </div>
);

const generateFlashes = (count) => {
  // Create clusters of positions
  const positions = [];
  
  // Generate some random focal points
  const focalPoints = Array.from({ length: 4 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return Array.from({ length: count }, (_, i) => {
    // Randomly choose whether to position near a focal point or completely random
    const useRandomPosition = Math.random() < 0.4;
    let top, left;

    if (useRandomPosition) {
      // Completely random position
      top = Math.random() * 120 - 10; // Allow slight overflow
      left = Math.random() * 120 - 10;
    } else {
      // Position near a random focal point
      const focalPoint = focalPoints[Math.floor(Math.random() * focalPoints.length)];
      const spread = 30; // Spread range around focal point
      top = focalPoint.y + (Math.random() - 0.5) * spread;
      left = focalPoint.x + (Math.random() - 0.5) * spread;
    }

    return {
      id: i,
      top: Math.max(-10, Math.min(110, top)), // Allow slight overflow but not too much
      left: Math.max(-10, Math.min(110, left)),
      delay: (Math.random() * 6) + (Math.random() < 0.3 ? 4 : 0),
      scale: 0.8 + Math.random() * 0.4 // Random size variation
    };
  });
};

const showcaseData = [
  {
    id: 1,
    title: "Live Performance",
    videoUrl: "/showcase/show1.mp4",
    description: "Energetic live performance"
  },
  {
    id: 2,
    title: "Concert Highlights",
    videoUrl: "/showcase/show2.mp4",
    description: "Best moments from recent shows"
  },
  {
    id: 3,
    title: "Festival Vibes",
    videoUrl: "/showcase/show3.mp4",
    description: "Festival atmosphere"
  },
  {
    id: 4,
    title: "Stage Presence",
    videoUrl: "/showcase/show4.mp4",
    description: "Commanding the stage"
  }
];

const ShowcaseCard = ({ title, videoUrl, description }) => (
  <div className="group relative overflow-hidden rounded-xl bg-neutral-900 transition-all duration-300 hover:scale-[1.02]">
    <div className="relative w-full pt-[100%]">
      <video 
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </div>
  </div>
);

const ShowcaseSection = () => {
  const [flashes] = useState(() => generateFlashes(15));

  return (
    <section className="w-full py-24 md:py-32 bg-black relative overflow-hidden">
      <style jsx>{`
        @keyframes wave {
          0% {
            background-position: 0% 50%, 0% 50%;
            filter: hue-rotate(0deg);
          }
          100% {
            background-position: -200% 50%, -200% 50%;
            filter: hue-rotate(0deg);
          }
        }

        .wild-text {
          background-image: 
            linear-gradient(
              -45deg,
              #ff1b6b 25%,
              #85ffbd 50%,
              #ff1b6b 75%,
              #85ffbd 100%
            ),
            linear-gradient(
              45deg,
              transparent 25%,
              rgba(255, 27, 107, 0.8) 50%,
              transparent 75%,
              rgba(133, 255, 189, 0.8) 100%
            );
          background-size: 200% 400%, 200% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wave 2s linear infinite;
          text-shadow: 
            0 0 20px rgba(255, 27, 107, 0.1),
            0 0 40px rgba(133, 255, 189, 0.1);
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .wild-text::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: inherit;
          filter: blur(8px) opacity(0.3);
          z-index: -1;
          transform: translateZ(-1px);
          animation: wave 2s linear infinite;
        }

        .wild-text:hover {
          text-shadow: 
            0 0 30px rgba(255, 27, 107, 0.3),
            0 0 60px rgba(133, 255, 189, 0.3);
        }
      `}</style>
      
      {flashes.map((flash) => (
        <FlashEffect
          key={flash.id}
          top={flash.top}
          left={flash.left}
          delay={flash.delay}
          scale={flash.scale}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          viewport={{ 
            once: false,
            amount: 0.8 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-16 tracking-tight"
        >
          Shows jsou <span className="wild-text">Wild</span>
        </motion.h2>
        
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 gap-3 md:gap-4"
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ 
              once: false,
              amount: 0.3 
            }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              },
              exit: {
                transition: {
                  staggerChildren: 0.1,
                  staggerDirection: -1
                }
              }
            }}
          >
            {showcaseData.map((item, index) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { 
                    opacity: 0, 
                    x: index % 2 === 0 ? -50 : 50 
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.8,
                      ease: "easeOut"
                    }
                  },
                  exit: {
                    opacity: 0,
                    x: index % 2 === 0 ? -50 : 50,
                    transition: {
                      duration: 0.6,
                      ease: "easeIn"
                    }
                  }
                }}
              >
                <ShowcaseCard
                  title={item.title}
                  videoUrl={item.videoUrl}
                  description={item.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
