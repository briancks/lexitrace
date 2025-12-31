# LexiTrace

An interactive etymology visualization tool that generates "UsefulCharts" style diagrams tracing words back to their ancient roots using AI-powered parsing.

![LexiTrace Demo](docs/demo.png)

## Features

- 🌳 **Hierarchical Tree Visualization** - D3.js-powered etymology trees
- 🎨 **Color-Coded Language Families** - Germanic (blue), Romance (red), Hellenic (green), PIE (purple)
- 🔍 **Interactive Tooltips** - Hover for detailed word information
- 📤 **Export Options** - PNG, SVG, and PDF export
- 🤖 **AI-Powered Parsing** - Uses Google Gemini to extract etymologies
- 💾 **Caching** - Supabase integration for storing parsed results

## Quick Start

```bash
# Install dependencies
npm install

# Start the frontend (http://localhost:5173)
cd client && npm run dev

# Optional: Start the backend (http://localhost:3001)
cd server && npm run dev
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite + React + TypeScript |
| Visualization | D3.js |
| Backend | Node.js + Express |
| AI Engine | Google Gemini API |
| Database | Supabase (PostgreSQL) |

## Environment Variables

Create `server/.env`:

```env
GEMINI_API_KEY=your_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Sample Words

The app includes mock data for testing:
- **Vlogger** - Complex portmanteau (Video + Blog → PIE roots)
- **Democracy** - Greek political term (Demos + Kratos)
- **World** - Germanic compound (Wer + Eld = "Man-Age")
- **Podcast** - Modern neologism (iPod + Broadcast)
- **Television** - Greek-Latin hybrid

## License

MIT
