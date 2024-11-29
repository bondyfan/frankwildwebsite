import React from 'react';

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
  return (
    <section className="w-full py-24 md:py-32 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-16 tracking-tight">
          Shows jsou <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Wild</span>
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {showcaseData.map((item) => (
              <ShowcaseCard
                key={item.id}
                title={item.title}
                videoUrl={item.videoUrl}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
