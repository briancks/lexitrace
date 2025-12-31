import { Router, Request, Response } from 'express';
import { getGeminiService } from '../services/geminiService.js';
import { getCacheService } from '../services/cacheService.js';
import { mockEtymologies, getMockEtymology } from '../data/mockEtymologies.js';

const router = Router();

// GET /api/etymology/:word - Get etymology for a word
router.get('/:word', async (req: Request, res: Response) => {
  const { word } = req.params;
  
  if (!word || word.trim().length === 0) {
    return res.status(400).json({ error: 'Word parameter is required' });
  }

  const normalizedWord = word.toLowerCase().trim();

  try {
    // 1. Check mock data first (for development)
    const mockData = getMockEtymology(normalizedWord);
    if (mockData) {
      return res.json(mockData);
    }

    // 2. Check cache
    const cacheService = getCacheService();
    if (cacheService) {
      const cached = await cacheService.getEtymology(normalizedWord);
      if (cached) {
        return res.json(cached);
      }
    }

    // 3. Use Gemini to parse etymology
    const geminiService = getGeminiService();
    if (!geminiService || !geminiService.isConfigured()) {
      return res.status(503).json({ 
        error: 'AI service not configured',
        message: 'Please provide a Gemini API key to enable etymology parsing for words not in the database.',
      });
    }

    const etymology = await geminiService.parseEtymology(word);

    // 4. Cache the result
    if (cacheService) {
      try {
        await cacheService.saveEtymology(normalizedWord, etymology);
      } catch (cacheError) {
        console.error('Failed to cache etymology:', cacheError);
        // Don't fail the request if caching fails
      }
    }

    return res.json(etymology);

  } catch (error) {
    console.error('Etymology lookup failed:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch etymology',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/etymology - List available mock etymologies
router.get('/', (_req: Request, res: Response) => {
  const availableWords = Object.keys(mockEtymologies);
  return res.json({
    message: 'Available mock etymologies',
    words: availableWords,
    count: availableWords.length,
  });
});

// POST /api/etymology/parse - Force parse etymology (bypass cache)
router.post('/parse', async (req: Request, res: Response) => {
  const { word } = req.body;
  
  if (!word || word.trim().length === 0) {
    return res.status(400).json({ error: 'Word is required in request body' });
  }

  const geminiService = getGeminiService();
  if (!geminiService || !geminiService.isConfigured()) {
    return res.status(503).json({ 
      error: 'AI service not configured',
      message: 'Please provide a Gemini API key.',
    });
  }

  try {
    const etymology = await geminiService.parseEtymology(word);
    
    // Cache the result
    const cacheService = getCacheService();
    if (cacheService) {
      try {
        await cacheService.saveEtymology(word.toLowerCase().trim(), etymology);
      } catch (cacheError) {
        console.error('Failed to cache etymology:', cacheError);
      }
    }

    return res.json(etymology);

  } catch (error) {
    console.error('Etymology parsing failed:', error);
    return res.status(500).json({ 
      error: 'Failed to parse etymology',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
