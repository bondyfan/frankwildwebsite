import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getVideoStats } from './src/server/youtubeCache.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Enable CORS for the Vite dev server
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET'],
  optionsSuccessStatus: 200
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// YouTube stats endpoint
app.get('/api/youtube-stats', async (req, res) => {
  try {
    console.log('Received request for YouTube stats');
    const stats = await getVideoStats();
    res.json(stats);
  } catch (error) {
    console.error('Error serving YouTube stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch YouTube stats',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`YouTube Stats Server Starting`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
