// Etymology data types (shared with client)

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

export interface EtymologyCacheEntry {
  id: string;
  word: string;
  etymology_tree: EtymologyTree;
  created_at: string;
  updated_at: string;
}
