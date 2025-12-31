import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { EtymologyTree, EtymologyNode, LANGUAGE_COLORS, LanguageFamily } from '../types/etymology';

interface EtymologyChartProps {
  data: EtymologyTree;
  onNodeHover?: (node: EtymologyNode | null, event: MouseEvent | null) => void;
}

interface TreeNode extends d3.HierarchyPointNode<EtymologyNode> {}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 70;
const VERTICAL_GAP = 40;
const HORIZONTAL_GAP = 20;

export const EtymologyChart: React.FC<EtymologyChartProps> = ({ data, onNodeHover }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 500) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current || !data || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create hierarchy from data
    const root = d3.hierarchy(data.root);
    
    // Calculate tree layout
    const treeLayout = d3.tree<EtymologyNode>()
      .nodeSize([NODE_WIDTH + HORIZONTAL_GAP, NODE_HEIGHT + VERTICAL_GAP]);

    const treeData = treeLayout(root);

    // Calculate bounds for centering
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    treeData.descendants().forEach(d => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y);
    });

    const treeWidth = maxX - minX + NODE_WIDTH;
    const treeHeight = maxY - minY + NODE_HEIGHT;

    // Center the tree
    const translateX = (dimensions.width - treeWidth) / 2 - minX + NODE_WIDTH / 2;
    const translateY = 60;

    // Create main group with transform
    const g = svg.append('g')
      .attr('transform', `translate(${translateX}, ${translateY})`);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Initial transform
    svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY));

    // Draw links (curved paths)
    const linkGenerator = d3.linkVertical<unknown, TreeNode>()
      .x(d => d.x)
      .y(d => d.y + NODE_HEIGHT / 2);

    g.selectAll('.link')
      .data(treeData.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d => {
        const source = { ...d.source, y: d.source.y + NODE_HEIGHT / 2 };
        const target = { ...d.target, y: d.target.y - NODE_HEIGHT / 2 };
        return `M${source.x},${source.y} C${source.x},${(source.y + target.y) / 2} ${target.x},${(source.y + target.y) / 2} ${target.x},${target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 2);

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x - NODE_WIDTH / 2}, ${d.y - NODE_HEIGHT / 2})`);

    // Node rectangles with gradient
    nodes.each(function(d) {
      const node = d3.select(this);
      const color = LANGUAGE_COLORS[d.data.languageFamily as LanguageFamily] || LANGUAGE_COLORS.other;
      
      // Create gradient
      const gradientId = `gradient-${d.data.id}`;
      const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
      
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.color(color)?.brighter(0.3)?.toString() || color);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(color)?.darker(0.3)?.toString() || color);

      node.append('rect')
        .attr('class', 'node-rect')
        .attr('width', NODE_WIDTH)
        .attr('height', NODE_HEIGHT)
        .attr('rx', 8)
        .attr('ry', 8)
        .attr('fill', `url(#${gradientId})`)
        .attr('stroke', d3.color(color)?.brighter(0.5)?.toString() || color)
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))');
    });

    // Word text
    nodes.append('text')
      .attr('class', 'node-text')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', '600')
      .attr('font-size', '14px')
      .text(d => d.data.word.length > 18 ? d.data.word.slice(0, 16) + '...' : d.data.word);

    // Language label
    nodes.append('text')
      .attr('class', 'node-language')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', 38)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.7)')
      .attr('font-size', '10px')
      .text(d => d.data.language);

    // Meaning text
    nodes.append('text')
      .attr('class', 'node-meaning')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', 54)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('font-size', '11px')
      .attr('font-style', 'italic')
      .text(d => {
        const meaning = d.data.meaning;
        return meaning.length > 20 ? meaning.slice(0, 18) + '...' : meaning;
      });

    // Hover interactions
    nodes
      .on('mouseenter', function(event, d) {
        d3.select(this).select('rect')
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.05)')
          .style('filter', 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4))');
        
        if (onNodeHover) {
          onNodeHover(d.data, event);
        }
      })
      .on('mouseleave', function() {
        d3.select(this).select('rect')
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)')
          .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))');
        
        if (onNodeHover) {
          onNodeHover(null, null);
        }
      });

  }, [data, dimensions, onNodeHover]);

  const handleExportSVG = useCallback(() => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.metadata.originalWord.toLowerCase()}-etymology.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <div ref={containerRef} className="chart-canvas" style={{ width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

// Export function to be used by parent component
export const exportChartAsSVG = (svgElement: SVGSVGElement, filename: string) => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const exportChartAsPNG = async (svgElement: SVGSVGElement, filename: string) => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise<void>((resolve) => {
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${filename}.png`;
          link.click();
        }
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };
    img.src = url;
  });
};
