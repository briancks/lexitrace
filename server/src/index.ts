import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import etymologyRoutes from './routes/etymology.js';
import { initGeminiService } from './services/geminiService.js';
import { initCacheService } from './services/cacheService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Initialize services
async function initializeServices() {
  // Initialize Gemini AI service
  if (process.env.GEMINI_API_KEY) {
    initGeminiService(process.env.GEMINI_API_KEY);
    console.log('✓ Gemini AI service initialized');
  } else {
    console.log('⚠ GEMINI_API_KEY not set - AI parsing disabled, using mock data only');
  }

  // Initialize database cache service
  if (process.env.DATABASE_URL) {
    try {
      await initCacheService(process.env.DATABASE_URL);
      console.log('✓ PostgreSQL cache service initialized');
    } catch (error) {
      console.error('✗ Failed to initialize cache service:', error);
    }
  } else {
    console.log('⚠ DATABASE_URL not set - caching disabled');
  }
}

// Routes
app.use('/api/etymology', etymologyRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      database: !!process.env.DATABASE_URL,
    },
  });
});

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
async function start() {
  await initializeServices();
  
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🌳 LexiTrace API Server                            ║
║                                                      ║
║   Running on: http://localhost:${PORT}                  ║
║                                                      ║
║   Endpoints:                                         ║
║   • GET  /api/etymology/:word  - Get etymology       ║
║   • GET  /api/etymology        - List mock words     ║
║   • POST /api/etymology/parse  - Force AI parsing    ║
║   • GET  /api/health           - Health check        ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
    `);
  });
}

start().catch(console.error);

export default app;
