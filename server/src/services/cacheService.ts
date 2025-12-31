import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EtymologyTree, EtymologyCacheEntry } from '../models/etymology.js';

export class CacheService {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async getEtymology(word: string): Promise<EtymologyTree | null> {
    const normalizedWord = word.toLowerCase().trim();
    
    const { data, error } = await this.client
      .from('etymologies')
      .select('*')
      .eq('word', normalizedWord)
      .single();

    if (error || !data) {
      return null;
    }

    return (data as EtymologyCacheEntry).etymology_tree;
  }

  async saveEtymology(word: string, etymologyTree: EtymologyTree): Promise<void> {
    const normalizedWord = word.toLowerCase().trim();

    const { error } = await this.client
      .from('etymologies')
      .upsert({
        word: normalizedWord,
        etymology_tree: etymologyTree,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'word',
      });

    if (error) {
      console.error('Failed to save etymology to cache:', error);
      throw error;
    }
  }

  async deleteEtymology(word: string): Promise<void> {
    const normalizedWord = word.toLowerCase().trim();

    const { error } = await this.client
      .from('etymologies')
      .delete()
      .eq('word', normalizedWord);

    if (error) {
      console.error('Failed to delete etymology from cache:', error);
      throw error;
    }
  }
}

// Singleton instance
let cacheService: CacheService | null = null;

export function initCacheService(supabaseUrl: string, supabaseKey: string): CacheService {
  cacheService = new CacheService(supabaseUrl, supabaseKey);
  return cacheService;
}

export function getCacheService(): CacheService | null {
  return cacheService;
}
