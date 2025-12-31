import { EtymologyTree } from '../types/etymology';

// Mock etymology data for development and testing

export const mockEtymologies: Record<string, EtymologyTree> = {
  vlogger: {
    root: {
      id: 'vlogger-root',
      word: 'Vlogger',
      language: 'English',
      era: '2000s',
      meaning: 'A person who vlogs',
      languageFamily: 'germanic',
      children: [
        {
          id: 'vlog',
          word: 'Vlog',
          language: 'English',
          era: '2000s',
          meaning: 'Video blog',
          languageFamily: 'germanic',
          children: [
            {
              id: 'video',
              word: 'Video',
              language: 'Latin',
              era: '1930s (from Latin)',
              meaning: 'I see',
              languageFamily: 'romance',
              children: [
                {
                  id: 'videre',
                  word: 'Vidēre',
                  language: 'Latin',
                  meaning: 'To see',
                  languageFamily: 'romance',
                  children: [
                    {
                      id: 'weid',
                      word: '*weyd-',
                      language: 'Proto-Indo-European',
                      meaning: 'To see, to know',
                      languageFamily: 'pie',
                    },
                  ],
                },
              ],
            },
            {
              id: 'blog',
              word: 'Blog',
              language: 'English',
              era: '1990s',
              meaning: 'Web log',
              languageFamily: 'germanic',
              children: [
                {
                  id: 'web',
                  word: 'Web',
                  language: 'Old English',
                  meaning: 'Woven fabric',
                  languageFamily: 'germanic',
                  children: [
                    {
                      id: 'wabjan',
                      word: '*Wabją',
                      language: 'Proto-Germanic',
                      meaning: 'Web, woven fabric',
                      languageFamily: 'germanic',
                      children: [
                        {
                          id: 'webh',
                          word: '*webʰ-',
                          language: 'Proto-Indo-European',
                          meaning: 'To weave',
                          languageFamily: 'pie',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'log',
                  word: 'Log',
                  language: 'Middle English',
                  meaning: 'Record, journal',
                  languageFamily: 'germanic',
                  children: [
                    {
                      id: 'lag',
                      word: 'Lág',
                      language: 'Old Norse',
                      meaning: 'Felled tree, log',
                      languageFamily: 'germanic',
                      children: [
                        {
                          id: 'legh',
                          word: '*legʰ-',
                          language: 'Proto-Indo-European',
                          meaning: 'To lie down',
                          languageFamily: 'pie',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'er-suffix',
          word: '-er',
          language: 'English',
          meaning: 'Agent suffix (one who does)',
          languageFamily: 'germanic',
        },
      ],
    },
    metadata: {
      originalWord: 'Vlogger',
      parsedAt: new Date().toISOString(),
      confidence: 0.95,
    },
  },

  democracy: {
    root: {
      id: 'democracy-root',
      word: 'Democracy',
      language: 'English',
      era: '16th century',
      meaning: 'Rule by the people',
      languageFamily: 'hellenic',
      children: [
        {
          id: 'demokratia',
          word: 'Dēmokratía',
          language: 'Ancient Greek',
          meaning: 'Popular government',
          languageFamily: 'hellenic',
          children: [
            {
              id: 'demos',
              word: 'Dêmos',
              language: 'Ancient Greek',
              meaning: 'The people, district',
              languageFamily: 'hellenic',
              children: [
                {
                  id: 'deh',
                  word: '*deh₂-',
                  language: 'Proto-Indo-European',
                  meaning: 'To divide',
                  languageFamily: 'pie',
                },
              ],
            },
            {
              id: 'kratos',
              word: 'Krátos',
              language: 'Ancient Greek',
              meaning: 'Power, rule, strength',
              languageFamily: 'hellenic',
              children: [
                {
                  id: 'kret',
                  word: '*kret-',
                  language: 'Proto-Indo-European',
                  meaning: 'Power, strength',
                  languageFamily: 'pie',
                },
              ],
            },
          ],
        },
      ],
    },
    metadata: {
      originalWord: 'Democracy',
      parsedAt: new Date().toISOString(),
      confidence: 0.98,
    },
  },

  world: {
    root: {
      id: 'world-root',
      word: 'World',
      language: 'English',
      era: 'Modern English',
      meaning: 'The earth and all its inhabitants',
      languageFamily: 'germanic',
      children: [
        {
          id: 'weorold',
          word: 'Weorold',
          language: 'Old English',
          meaning: 'Human existence, the earth',
          languageFamily: 'germanic',
          children: [
            {
              id: 'wer',
              word: 'Wer',
              language: 'Old English',
              meaning: 'Man',
              languageFamily: 'germanic',
              children: [
                {
                  id: 'wiraz',
                  word: '*Wiraz',
                  language: 'Proto-Germanic',
                  meaning: 'Man',
                  languageFamily: 'germanic',
                  children: [
                    {
                      id: 'wihros',
                      word: '*wiHrós',
                      language: 'Proto-Indo-European',
                      meaning: 'Man, hero',
                      languageFamily: 'pie',
                    },
                  ],
                },
              ],
            },
            {
              id: 'eld',
              word: 'Eld',
              language: 'Old English',
              meaning: 'Age, period of time',
              languageFamily: 'germanic',
              children: [
                {
                  id: 'aldiz',
                  word: '*Aldiz',
                  language: 'Proto-Germanic',
                  meaning: 'Age, life',
                  languageFamily: 'germanic',
                  children: [
                    {
                      id: 'altom',
                      word: '*h₂eltom',
                      language: 'Proto-Indo-European',
                      meaning: 'To grow, nourish',
                      languageFamily: 'pie',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    metadata: {
      originalWord: 'World',
      parsedAt: new Date().toISOString(),
      confidence: 0.97,
    },
  },

  podcast: {
    root: {
      id: 'podcast-root',
      word: 'Podcast',
      language: 'English',
      era: '2004',
      meaning: 'Digital audio broadcast',
      languageFamily: 'germanic',
      children: [
        {
          id: 'ipod',
          word: 'iPod',
          language: 'English (brand)',
          era: '2001',
          meaning: 'Portable media player',
          languageFamily: 'other',
        },
        {
          id: 'broadcast',
          word: 'Broadcast',
          language: 'English',
          era: '18th century',
          meaning: 'To scatter widely',
          languageFamily: 'germanic',
          children: [
            {
              id: 'broad',
              word: 'Broad',
              language: 'Old English',
              meaning: 'Wide, spacious',
              languageFamily: 'germanic',
              children: [
                {
                  id: 'braidaz',
                  word: '*Braidaz',
                  language: 'Proto-Germanic',
                  meaning: 'Broad, wide',
                  languageFamily: 'germanic',
                },
              ],
            },
            {
              id: 'cast',
              word: 'Cast',
              language: 'Old Norse',
              meaning: 'To throw',
              languageFamily: 'germanic',
              children: [
                {
                  id: 'kasta',
                  word: 'Kasta',
                  language: 'Old Norse',
                  meaning: 'To throw',
                  languageFamily: 'germanic',
                },
              ],
            },
          ],
        },
      ],
    },
    metadata: {
      originalWord: 'Podcast',
      parsedAt: new Date().toISOString(),
      confidence: 0.92,
    },
  },

  television: {
    root: {
      id: 'television-root',
      word: 'Television',
      language: 'English',
      era: '1900s',
      meaning: 'Far-seeing device',
      languageFamily: 'hellenic',
      children: [
        {
          id: 'tele',
          word: 'Tele-',
          language: 'Greek',
          meaning: 'Far, distant',
          languageFamily: 'hellenic',
          children: [
            {
              id: 'telos',
              word: 'Têle',
              language: 'Ancient Greek',
              meaning: 'Far off, at a distance',
              languageFamily: 'hellenic',
              children: [
                {
                  id: 'kwel',
                  word: '*kwel-',
                  language: 'Proto-Indo-European',
                  meaning: 'Far (in space or time)',
                  languageFamily: 'pie',
                },
              ],
            },
          ],
        },
        {
          id: 'vision',
          word: 'Vision',
          language: 'Latin',
          meaning: 'Sight, thing seen',
          languageFamily: 'romance',
          children: [
            {
              id: 'visio',
              word: 'Vīsiō',
              language: 'Latin',
              meaning: 'A seeing, sight',
              languageFamily: 'romance',
              children: [
                {
                  id: 'videre2',
                  word: 'Vidēre',
                  language: 'Latin',
                  meaning: 'To see',
                  languageFamily: 'romance',
                  children: [
                    {
                      id: 'weid2',
                      word: '*weyd-',
                      language: 'Proto-Indo-European',
                      meaning: 'To see, to know',
                      languageFamily: 'pie',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    metadata: {
      originalWord: 'Television',
      parsedAt: new Date().toISOString(),
      confidence: 0.96,
    },
  },
};

export function getMockEtymology(word: string): EtymologyTree | null {
  const normalizedWord = word.toLowerCase().trim();
  return mockEtymologies[normalizedWord] || null;
}
