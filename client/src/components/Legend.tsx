import React from 'react';
import { LANGUAGE_COLORS, LANGUAGE_LABELS, LanguageFamily } from '../types/etymology';

interface LegendProps {
  visibleFamilies?: LanguageFamily[];
}

export const Legend: React.FC<LegendProps> = ({ visibleFamilies }) => {
  const families = visibleFamilies || (Object.keys(LANGUAGE_COLORS) as LanguageFamily[]);

  return (
    <div className="legend">
      {families.map((family) => (
        <div key={family} className="legend-item">
          <span 
            className="legend-color" 
            style={{ backgroundColor: LANGUAGE_COLORS[family] }}
          />
          <span>{LANGUAGE_LABELS[family]}</span>
        </div>
      ))}
    </div>
  );
};
