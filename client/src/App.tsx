import React, { useState, useRef, useCallback } from 'react';
import { WordInput } from './components/WordInput';
import { EtymologyChart, exportChartAsSVG, exportChartAsPNG } from './components/EtymologyChart';
import { Legend } from './components/Legend';
import { ExportPanel } from './components/ExportPanel';
import { Tooltip } from './components/Tooltip';
import { useEtymology } from './hooks/useEtymology';
import { EtymologyNode, LanguageFamily } from './types/etymology';

function App() {
  const { etymology, loading, error, fetchEtymology } = useEtymology();
  const [hoveredNode, setHoveredNode] = useState<EtymologyNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<SVGSVGElement | null>(null);

  const handleNodeHover = useCallback((node: EtymologyNode | null, event: MouseEvent | null) => {
    setHoveredNode(node);
    if (event) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  }, []);

  const handleExportPNG = useCallback(async () => {
    const svg = document.querySelector('.chart-canvas svg') as SVGSVGElement;
    if (svg && etymology) {
      await exportChartAsPNG(svg, etymology.metadata.originalWord.toLowerCase() + '-etymology');
    }
  }, [etymology]);

  const handleExportSVG = useCallback(() => {
    const svg = document.querySelector('.chart-canvas svg') as SVGSVGElement;
    if (svg && etymology) {
      exportChartAsSVG(svg, etymology.metadata.originalWord.toLowerCase() + '-etymology');
    }
  }, [etymology]);

  const handleExportPDF = useCallback(async () => {
    // PDF export would require jsPDF library
    // For now, we'll use a simple approach: open SVG in new window for printing
    const svg = document.querySelector('.chart-canvas svg') as SVGSVGElement;
    if (svg && etymology) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${etymology.metadata.originalWord} Etymology</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background: #0a0a0f;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
              </style>
            </head>
            <body>
              ${svgData}
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  }, [etymology]);

  // Get unique language families from etymology for legend
  const getVisibleFamilies = (): LanguageFamily[] => {
    if (!etymology) return [];
    
    const families = new Set<LanguageFamily>();
    const traverse = (node: EtymologyNode) => {
      families.add(node.languageFamily);
      node.children?.forEach(traverse);
    };
    traverse(etymology.root);
    return Array.from(families);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="url(#logo-gradient)" strokeWidth="2" />
            <path d="M16 6 L16 26 M8 12 L24 12 M10 20 L22 20" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          LexiTrace
        </div>
        {etymology && (
          <ExportPanel
            onExportPNG={handleExportPNG}
            onExportSVG={handleExportSVG}
            onExportPDF={handleExportPDF}
            disabled={!etymology}
          />
        )}
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Search Section */}
        <section className="search-section">
          <h1 className="search-title">Trace the Origins of Words</h1>
          <p className="search-subtitle">
            Enter a word to visualize its etymology from modern usage back to ancient roots
          </p>
          <WordInput onSearch={fetchEtymology} loading={loading} />
        </section>

        {/* Chart Section */}
        <section className="chart-section">
          <div className="chart-header">
            <h2 className="chart-title">
              {etymology 
                ? `Etymology of "${etymology.metadata.originalWord}"`
                : 'Etymology Chart'
              }
            </h2>
            {etymology && (
              <div className="chart-controls">
                <button className="btn-icon" title="Reset zoom" onClick={() => window.location.reload()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="chart-canvas">
            {loading && (
              <div className="loading">
                <div className="loading-spinner" />
                <span className="loading-text">Tracing etymology...</span>
              </div>
            )}

            {error && (
              <div className="error-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6M9 9l6 6" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && !etymology && (
              <div className="empty-state">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <p>Enter a word above to generate its etymology chart</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Try: Vlogger, Democracy, World, Podcast, or Television
                </p>
              </div>
            )}

            {etymology && !loading && (
              <EtymologyChart 
                data={etymology} 
                onNodeHover={handleNodeHover}
              />
            )}
          </div>

          {etymology && <Legend visibleFamilies={getVisibleFamilies()} />}
        </section>
      </main>

      {/* Tooltip */}
      <Tooltip 
        node={hoveredNode} 
        x={tooltipPosition.x} 
        y={tooltipPosition.y} 
      />
    </div>
  );
}

export default App;
