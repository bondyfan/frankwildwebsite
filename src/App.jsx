import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MediaSection from './components/MediaSection';
import HeroSection from './components/HeroSection';
import TourSection from './components/TourSection';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <MediaSection />
            <TourSection />
            <section id="contact" className="py-24 bg-gray-50">
              <div className="container">
                <h2 className="text-4xl font-bold mb-8 text-center">Kontakt</h2>
                <div className="text-center">
                  <p className="text-lg text-muted-foreground mb-6">Pro spolupráci nebo další informace mě můžete kontaktovat na sociálních sítích:</p>
                  <div className="flex justify-center gap-6">
                    <a href="https://www.instagram.com/frankwildmusic/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900">Instagram</a>
                    <a href="https://www.tiktok.com/@frankwildmusic" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900">TikTok</a>
                    <a href="https://www.youtube.com/channel/FrankWild" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900">YouTube</a>
                  </div>
                </div>
              </div>
            </section>
          </>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
