import pg from 'pg';
import { EtymologyTree } from '../models/etymology.js';

const { Pool } = pg;

export class CacheService {
  private pool: pg.Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });
  }

  async initialize(): Promise<void> {
    // Create the etymologies table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS etymologies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        word VARCHAR(255) NOT NULL UNIQUE,
        etymology_tree JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_etymologies_word ON etymologies(word);
    `;

    try {
      await this.pool.query(createTableQuery);
      console.log('✓ Etymology cache table ready');
    } catch (error) {
      console.error('Failed to initialize cache table:', error);
    }
  }

  async getEtymology(word: string): Promise<EtymologyTree | null> {
    const normalizedWord = word.toLowerCase().trim();
    
    try {
      const result = await this.pool.query(
        'SELECT etymology_tree FROM etymologies WHERE word = $1',
        [normalizedWord]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0].etymology_tree as EtymologyTree;
    } catch (error) {
      console.error('Cache lookup failed:', error);
      return null;
    }
  }

  async saveEtymology(word: string, etymologyTree: EtymologyTree): Promise<void> {
    const normalizedWord = word.toLowerCase().trim();

    try {
      await this.pool.query(
        `INSERT INTO etymologies (word, etymology_tree, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (word) 
         DO UPDATE SET etymology_tree = $2, updated_at = NOW()`,
        [normalizedWord, JSON.stringify(etymologyTree)]
      );
    } catch (error) {
      console.error('Failed to save etymology to cache:', error);
      throw error;
    }
  }

  async deleteEtymology(word: string): Promise<void> {
    const normalizedWord = word.toLowerCase().trim();

    try {
      await this.pool.query(
        'DELETE FROM etymologies WHERE word = $1',
        [normalizedWord]
      );
    } catch (error) {
      console.error('Failed to delete etymology from cache:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Singleton instance
let cacheService: CacheService | null = null;

export async function initCacheService(databaseUrl: string): Promise<CacheService> {
  cacheService = new CacheService(databaseUrl);
  await cacheService.initialize();
  return cacheService;
}

export function getCacheService(): CacheService | null {
  return cacheService;
}
