import React, { useState } from 'react';
import { EtymologyNode } from '../types/etymology';

interface TooltipProps {
  node: EtymologyNode | null;
  x: number;
  y: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ node, x, y }) => {
  if (!node) return null;

  return (
    <div 
      className="tooltip fade-in"
      style={{
        left: x + 15,
        top: y + 15,
      }}
    >
      <div className="tooltip-word">{node.word}</div>
      <div className="tooltip-language">
        {node.language}
        {node.era && <span> • {node.era}</span>}
      </div>
      <div className="tooltip-meaning">"{node.meaning}"</div>
    </div>
  );
};
