// Etymology data types

export type LanguageFamily = 
  | 'germanic' 
  | 'romance' 
  | 'hellenic' 
  | 'pie' 
  | 'semitic' 
  | 'slavic'
  | 'celtic'
  | 'other';

export interface EtymologyNode {
  id: string;
  word: string;
  language: string;
  era?: string;
  meaning: string;
  languageFamily: LanguageFamily;
  children?: EtymologyNode[];
}

export interface EtymologyTree {
  root: EtymologyNode;
  metadata: {
    originalWord: string;
    parsedAt: string;
    confidence: number;
  };
}

// Color mapping for language families
export const LANGUAGE_COLORS: Record<LanguageFamily, string> = {
  germanic: '#3b82f6',  // Blue
  romance: '#ef4444',   // Red
  hellenic: '#22c55e',  // Green
  pie: '#a855f7',       // Purple
  semitic: '#f59e0b',   // Amber
  slavic: '#06b6d4',    // Cyan
  celtic: '#84cc16',    // Lime
  other: '#6b7280',     // Gray
};

export const LANGUAGE_LABELS: Record<LanguageFamily, string> = {
  germanic: 'Germanic',
  romance: 'Romance',
  hellenic: 'Hellenic',
  pie: 'Proto-Indo-European',
  semitic: 'Semitic',
  slavic: 'Slavic',
  celtic: 'Celtic',
  other: 'Other',
};
