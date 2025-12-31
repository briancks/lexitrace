import { useState, useCallback } from 'react';
import { EtymologyTree } from '../types/etymology';
import { getMockEtymology } from '../data/mockEtymologies';

interface UseEtymologyResult {
  etymology: EtymologyTree | null;
  loading: boolean;
  error: string | null;
  fetchEtymology: (word: string) => Promise<void>;
  clearEtymology: () => void;
}

export function useEtymology(): UseEtymologyResult {
  const [etymology, setEtymology] = useState<EtymologyTree | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEtymology = useCallback(async (word: string) => {
    if (!word.trim()) {
      setError('Please enter a word');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // First check mock data
      const mockData = getMockEtymology(word);
      
      if (mockData) {
        setEtymology(mockData);
        return;
      }

      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`/api/etymology/${encodeURIComponent(word)}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch etymology');
      // }
      // const data = await response.json();
      // setEtymology(data);

      // For now, show error for words not in mock data
      setError(`Etymology for "${word}" not found. Try: Vlogger, Democracy, World, Podcast, or Television`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEtymology(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearEtymology = useCallback(() => {
    setEtymology(null);
    setError(null);
  }, []);

  return {
    etymology,
    loading,
    error,
    fetchEtymology,
    clearEtymology,
  };
}
