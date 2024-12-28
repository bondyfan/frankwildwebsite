import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './ShowcaseSection.module.css';

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
      className={`absolute w-6 h-6 opacity-0 ${styles.flashAnimation}`}
      style={{
        top: `${currentPosition.top}%`,
        left: `${currentPosition.left}%`
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
    title: "NEJPOSLOUCHANĚJŠÍ SONGY A JEJICH REMIXY",
    description: "Tvořený speciálně pro show",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "INTERAKTIVNÍ HUDBA A SOUTĚŽE",
    description: "Zapojíme publikum do show",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    )
  },
  {
    id: 3,
    title: "REKVIZITY, KOSTÝMY A POSTAVY",
    description: "z videoklipů",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    )
  },
  {
    id: 4,
    title: "TANEČNICE S CHOREOGRAFIÍ",
    description: "Profesionální taneční vystoupení",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    )
  }
];

const videoData = [
  {
    id: 1,
    title: "Bobby Hall Brno",
    videoUrl: "/showcase/show1.mp4",
    description: "3000 lidí",
    poster: "/showcase/show1-poster.jpg"
  },
  {
    id: 2,
    title: "PSG Arena Zlín",
    videoUrl: "/showcase/show2.mp4",
    description: "1000 lidí",
    poster: "/showcase/show2-poster.jpg"
  },
  {
    id: 3,
    title: "Zámek Choltice",
    videoUrl: "/showcase/show3.mp4",
    description: "Vyprodáno - 1000 lidí",
    poster: "/showcase/show3-poster.jpg"
  },
  {
    id: 4,
    title: "",
    videoUrl: "/showcase/show4.mp4",
    description: "Commanding the stage",
    poster: "/showcase/show4-poster.jpg"
  }
];

const ShowcaseCard = ({ icon, title, description }) => (
  <div className="group relative overflow-hidden rounded-xl bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] p-6 h-[200px] flex flex-col">
    <div className="text-white mb-4 w-10 h-10 shrink-0">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-white shrink-0 leading-tight">{title}</h3>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

const VideoCard = ({ title, videoUrl, description, poster }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <div className="group relative w-full pb-[100%]">
      <div className="absolute inset-0 overflow-hidden rounded-xl bg-neutral-900">
        <div className="relative h-full w-full">
          <video 
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            onError={(e) => console.log('Video error:', e)}
            poster={poster}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <div className="animate-pulse w-8 h-8 rounded-full bg-neutral-700"></div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 p-4 text-white">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-gray-200">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowcaseSection = () => {
  // Create a pool of 100 random positions
  const [positions] = useState(() => generatePositions(100));
  
  // Create 15 flash effects that will randomly pick from these positions
  const flashCount = 100;

  return (
    <section className="w-full py-24 md:py-32 min-h-screen bg-black relative overflow-hidden">
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
          className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-16 tracking-tight flex justify-center items-center gap-3 ${styles.wildText}`}
        >
          <span>Shows jsou</span> <span className={styles.wildText}>Wild</span>
        </motion.h2>

        {/* Video Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24"
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
          {videoData.map((item) => (
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
              <VideoCard
                title={item.title}
                videoUrl={item.videoUrl}
                description={item.description}
                poster={item.poster}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
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
                icon={item.icon}
                title={item.title}
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
