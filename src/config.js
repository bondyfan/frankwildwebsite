// API URL configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API configuration
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('YouTube API key is not set. Make sure to set VITE_YOUTUBE_API_KEY in your .env file');
}
