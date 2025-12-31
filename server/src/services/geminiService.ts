import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { EtymologyTree, LanguageFamily } from '../models/etymology.js';

const ETYMOLOGY_PROMPT = `You are an expert etymologist. Analyze the given word and create a detailed etymology tree tracing it back to its ancient roots (Proto-Indo-European, Proto-Germanic, Latin, Greek, etc.).

For each node in the tree, provide:
1. The word form in that specific period/language
2. The language name (e.g., "Old English", "Latin", "Proto-Indo-European")
3. The literal meaning
4. The language family: one of "germanic", "romance", "hellenic", "pie", "semitic", "slavic", "celtic", or "other"
5. Era if applicable (e.g., "16th century", "1990s")

For compound words, portmanteaus, or words with prefixes/suffixes, create branches showing each component's etymology.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "root": {
    "id": "unique-id",
    "word": "ModernWord",
    "language": "English",
    "era": "optional era",
    "meaning": "current meaning",
    "languageFamily": "germanic",
    "children": [
      {
        "id": "child-id",
        "word": "ParentForm",
        "language": "Parent Language",
        "meaning": "parent meaning",
        "languageFamily": "germanic",
        "children": []
      }
    ]
  },
  "metadata": {
    "originalWord": "ModernWord",
    "parsedAt": "ISO timestamp",
    "confidence": 0.95
  }
}

Ensure the tree is historically accurate and follows proper linguistic derivation paths.`;

export class GeminiService {
  private model: GenerativeModel;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async parseEtymology(word: string, retries = 3): Promise<EtymologyTree> {
    const prompt = `${ETYMOLOGY_PROMPT}\n\nAnalyze this word: "${word}"`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const parsed = JSON.parse(text) as EtymologyTree;
        
        // Validate structure
        if (!parsed.root || !parsed.root.word || !parsed.metadata) {
          throw new Error('Invalid etymology structure');
        }
        
        // Add parsed timestamp if missing
        if (!parsed.metadata.parsedAt) {
          parsed.metadata.parsedAt = new Date().toISOString();
        }
        
        return parsed;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          throw new Error(`Failed to parse etymology after ${retries} attempts: ${error}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Unexpected error in parseEtymology');
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }
}

// Singleton instance - will be initialized when API key is provided
let geminiService: GeminiService | null = null;

export function initGeminiService(apiKey: string): GeminiService {
  geminiService = new GeminiService(apiKey);
  return geminiService;
}

export function getGeminiService(): GeminiService | null {
  return geminiService;
}
