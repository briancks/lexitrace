import { useState, useCallback } from 'react';
import { EtymologyTree } from '../types/etymology';

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
      // Call the backend API
      const response = await fetch(`/api/etymology/${encodeURIComponent(word.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch etymology');
      }
      
      const data = await response.json();
      setEtymology(data);
      
    } catch (err) {
      console.error('Etymology fetch error:', err);
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
