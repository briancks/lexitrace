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

// Initialize services if environment variables are set
if (process.env.GEMINI_API_KEY) {
  initGeminiService(process.env.GEMINI_API_KEY);
  console.log('✓ Gemini service initialized');
} else {
  console.log('⚠ GEMINI_API_KEY not set - AI parsing disabled, using mock data only');
}

if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  initCacheService(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  console.log('✓ Supabase cache service initialized');
} else {
  console.log('⚠ SUPABASE_URL/SUPABASE_KEY not set - caching disabled');
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
      supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY),
    },
  });
});

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
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

export default app;
