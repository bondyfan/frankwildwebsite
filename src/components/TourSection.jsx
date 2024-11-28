import React from 'react';
import { concerts } from '../constants/constants';

function TourSection() {
  return (
    <section id="tour" className="py-24 bg-white">
      <div className="container">
        <h2 className="text-4xl font-bold mb-12 text-center">Nadcházející koncerty</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Město</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Místo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vstupenky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {concerts.map((concert, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{concert.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{concert.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{concert.venue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={concert.ticketLink} className="text-purple-600 hover:text-purple-900">Koupit vstupenky</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TourSection;
