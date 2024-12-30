import React from 'react';
import Navbar from './components/Navbar';
import MediaSection from './components/MediaSection';
import HeroSection from './components/HeroSection';
import TourSection from './components/TourSection';
import ShowcaseSection from './components/ShowcaseSection';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MediaSection />
      <ShowcaseSection />
      <TourSection />

      <section id="contact" className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-5xl font-bold mb-12 text-center">Kontakt</h2>
          <div className="text-center">
            <div className="mb-16 flex flex-col items-center">
              <p className="text-2xl text-gray-700 mb-6">Pro spolupráci nebo booking:</p>
              <div className="inline-block">
                <a href="mailto:spoluprace@frankwild.net" 
                   className="luxury-email-container group relative inline-block">
                  <div className="bg-black px-10 py-6 rounded-xl transform transition-transform duration-300 group-hover:scale-105 shadow-2xl">
                    <span className="text-xl md:text-3xl font-bold text-white ">
                      spoluprace@frankwild.net
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <div>
              <p className="text-2xl text-gray-700 mb-8">Sociální sítě:</p>
              <div className="flex justify-center items-center gap-16">
                <a 
                  href="https://www.instagram.com/frankwild/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-200"
                >
                  <div className="instagram-gradient p-4 rounded-2xl shadow-lg">
                    <FaInstagram className="w-16 h-16 text-white" />
                  </div>
                </a>
                <a 
                  href="https://www.youtube.com/@frankwildofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-200"
                >
                  <div className="bg-[#FF0000] p-4 rounded-2xl shadow-lg">
                    <FaYoutube className="w-16 h-16 text-white" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .instagram-gradient {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
        }
        .luxury-email-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
          border-radius: 0.75rem;
          transform: scale(1.02);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .luxury-email-container:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default App;
