import React from 'react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="text-xl font-bold">Frank Wild</a>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-600 hover:text-gray-900">O mně</a>
            <a href="#portfolio" className="text-gray-600 hover:text-gray-900">Portfolio</a>
            <a href="#tour" className="text-gray-600 hover:text-gray-900">Koncerty</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Kontakt</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
