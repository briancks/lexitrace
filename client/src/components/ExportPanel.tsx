import React from 'react';

interface ExportPanelProps {
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  onExportPNG,
  onExportSVG,
  onExportPDF,
  disabled = false,
}) => {
  return (
    <div className="export-panel">
      <button 
        className="btn btn-secondary" 
        onClick={onExportPNG}
        disabled={disabled}
        title="Export as PNG"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        PNG
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={onExportSVG}
        disabled={disabled}
        title="Export as SVG"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
        SVG
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={onExportPDF}
        disabled={disabled}
        title="Export as PDF"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
        PDF
      </button>
    </div>
  );
};
