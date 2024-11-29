import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const generatePositions = (count) => {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 160 - 30,
    left: Math.random() * 160 - 30,
  }));
};

const FlashEffect = ({ positions }) => {
  const [currentPosition, setCurrentPosition] = useState(positions[0]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      setCurrentPosition(randomPosition);
      setKey(k => k + 1);
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, [positions]);

  return (
    <div 
      key={key}
      className="absolute w-6 h-6 opacity-0"
      style={{
        top: `${currentPosition.top}%`,
        left: `${currentPosition.left}%`,
        animation: 'flash 0.3s linear',
        animationIterationCount: '1',
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
  // Create a pool of 100 random positions
  const [positions] = useState(() => generatePositions(100));
  
  // Create 15 flash effects that will randomly pick from these positions
  const flashCount = 100;

  return (
    <section className="w-full py-24 md:py-32 min-h-screen bg-black relative overflow-hidden">
      <style jsx>{`
        @keyframes flash {
          0% {
            opacity: 0;
            transform: scale(0.2);
          }
          10% {
            opacity: 1;
            transform: scale(1.2);
          }
          20%, 100% {
            opacity: 0;
            transform: scale(0.2);
          }
        }

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
      
      {Array.from({ length: flashCount }).map((_, index) => (
        <FlashEffect key={index} positions={positions} />
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Showcase</h2>
          <p className="text-xl text-gray-400">Check out our latest work</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
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
                  y: 50
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut"
                  }
                },
                exit: {
                  opacity: 0,
                  y: -50,
                  transition: {
                    duration: 0.6,
                    ease: "easeIn"
                  }
                }
              }}
              className="group relative"
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
    </section>
  );
};

export default ShowcaseSection;
