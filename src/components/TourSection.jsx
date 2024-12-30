import React from 'react';
import { FaTicketAlt } from 'react-icons/fa';

function TourSection() {
  return (
    <section id="tour" className="py-24 bg-white">
      
      <div className=" ">
        <h2 className="text-4xl font-bold container mb-12 text-center">Nadcházející koncerty</h2>
        <h3 className="text-6xl font-bold mb-8 text-center">2025</h3>
        <div className="marquee-container mb-4">
          <div className="marquee-content">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="mx-8 text-4xl font-bold px-6 py-2 bg-black text-white rounded-lg">
                <FaTicketAlt className="inline-block mr-3" />
                PŘIPRAVUJEME
              </span>
            ))}
            {[...Array(20)].map((_, i) => (
              <span key={i + 20} className="mx-8 text-4xl font-bold px-6 py-2 bg-black text-white rounded-lg">
                <FaTicketAlt className="inline-block mr-3" />
                PŘIPRAVUJEME
              </span>
            ))}
          </div>
        </div>
        <div className="marquee-container mb-4">
          <div className="marquee-content-reverse">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="mx-8 text-4xl font-bold px-6 py-2 bg-black text-white rounded-lg">
                <FaTicketAlt className="inline-block mr-3" />
                PŘIPRAVUJEME
              </span>
            ))}
            {[...Array(20)].map((_, i) => (
              <span key={i + 20} className="mx-8 text-4xl font-bold px-6 py-2 bg-black text-white rounded-lg">
                <FaTicketAlt className="inline-block mr-3" />
                PŘIPRAVUJEME
              </span>
            ))}
          </div>
        </div>
        <div className="marquee-container">
          <div className="marquee-content">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="mx-8 text-4xl font-bold px-6 py-2 bg-black text-white rounded-lg">
                <FaTicketAlt className="inline-block mr-3" />
                PŘIPRAVUJEME
              </span>
            ))}
            {[...Array(20)].map((_, i) => (
              <span key={i + 20} className="mx-8 text-4xl font-bold px-6 py-2 bg-black text-white rounded-lg">
                <FaTicketAlt className="inline-block mr-3" />
                PŘIPRAVUJEME
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
          .marquee-container {
            width: 100%;
            overflow: hidden;
            position: relative;
          }
          .marquee-content {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 90s linear infinite;
          }
          .marquee-content-reverse {
            display: inline-block;
            white-space: nowrap;
            animation: marquee-reverse 90s linear infinite;
          }
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @keyframes marquee-reverse {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}
      </style>
 
    </section>
  );
}

export default TourSection;
