'use client';

import { useState } from 'react';
import type { NetworkNode, NetworkEdge } from '@/lib/types';

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  width?: number;
  height?: number;
}

const NODE_COLORS = {
  user: { fill: '#1e293b', stroke: '#3b82f6', text: '#93c5fd' },
  merchant: { fill: '#1e293b', stroke: '#6b7280', text: '#9ca3af' },
  suspicious: { fill: '#450a0a', stroke: '#ef4444', text: '#fca5a5' },
};

const RISK_EDGE_COLOR = '#ef4444';
const NORMAL_EDGE_COLOR = '#374151';

export default function NetworkGraph({ nodes, edges, width = 500, height = 420 }: NetworkGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ node: NetworkNode; x: number; y: number } | null>(null);

  const handleNodeEnter = (node: NetworkNode) => {
    setHoveredNode(node.id);
    setTooltip({ node, x: node.x, y: node.y });
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
    setTooltip(null);
  };


  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        className="overflow-visible"
      >
        <defs>
          {/* Glow filters */}
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Arrow markers */}
          <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={RISK_EDGE_COLOR} />
          </marker>
          <marker id="arrow-gray" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={NORMAL_EDGE_COLOR} />
          </marker>
        </defs>

        {/* Background grid */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1a1a22" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" rx="6" />

        {/* Edges */}
        {edges.map((edge) => {
          const src = nodes.find((n) => n.id === edge.source);
          const tgt = nodes.find((n) => n.id === edge.target);
          if (!src || !tgt) return null;

          const x1 = src.x;
          const y1 = src.y;
          const x2 = tgt.x;
          const y2 = tgt.y;

          // Shorten edge to not overlap node circles
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nodeR = 24;
          const nx = dx / len;
          const ny = dy / len;
          const ex1 = x1 + nx * nodeR;
          const ey1 = y1 + ny * nodeR;
          const ex2 = x2 - nx * nodeR;
          const ey2 = y2 - ny * nodeR;

          const isSuspicious = edge.suspicious;
          const isHighlighted = hoveredNode === src.id || hoveredNode === tgt.id;

          return (
            <g key={edge.id}>
              <line
                x1={ex1}
                y1={ey1}
                x2={ex2}
                y2={ey2}
                stroke={isSuspicious ? RISK_EDGE_COLOR : NORMAL_EDGE_COLOR}
                strokeWidth={isSuspicious ? (isHighlighted ? 2.5 : 1.5) : 1}
                strokeOpacity={isHighlighted ? 1 : isSuspicious ? 0.7 : 0.35}
                markerEnd={isSuspicious ? 'url(#arrow-red)' : 'url(#arrow-gray)'}
                strokeDasharray={isSuspicious ? '0' : '4 3'}
                filter={isSuspicious && isHighlighted ? 'url(#glow-red)' : undefined}
              />
              {isSuspicious && (
                <text
                  x={(ex1 + ex2) / 2}
                  y={(ey1 + ey2) / 2 - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#ef4444"
                  fillOpacity={0.7}
                  fontFamily="JetBrains Mono, monospace"
                >
                  ₹{(edge.amount / 1000).toFixed(0)}k
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const colors = NODE_COLORS[node.type];
          const isHovered = hoveredNode === node.id;
          const isSuspicious = node.type === 'suspicious';
          const r = isSuspicious ? 30 : 22;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="network-node"
              onMouseEnter={() => handleNodeEnter(node)}
              onMouseLeave={handleNodeLeave}
            >
              {/* Outer glow for suspicious */}
              {isSuspicious && (
                <circle
                  r={r + 8}
                  fill="rgba(239,68,68,0.08)"
                  className="animate-pulse"
                />
              )}
              {/* Node circle */}
              <circle
                r={r}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={isHovered ? 2.5 : isSuspicious ? 2 : 1.5}
                filter={isHovered ? 'url(#glow-blue)' : isSuspicious ? 'url(#glow-red)' : undefined}
                style={{ transition: 'stroke-width 0.15s' }}
              />
              {/* Node label */}
              <text
                textAnchor="middle"
                dy="0.35em"
                fontSize={isSuspicious ? '10' : '9'}
                fontWeight="600"
                fill={colors.text}
                fontFamily="Inter, sans-serif"
              >
                {node.label}
              </text>
              {/* Transaction count badge */}
              {isHovered && (
                <g transform={`translate(${r - 4}, ${-r + 4})`}>
                  <circle r="8" fill="#ef4444" />
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fontSize="7"
                    fontWeight="700"
                    fill="white"
                  >
                    {node.transactionCount}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none card px-3 py-2 text-[12px] min-w-[160px] z-10"
          style={{
            left: `${(tooltip.node.x / 500) * 100}%`,
            top: `${(tooltip.node.y / 420) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          <p className="font-semibold text-white mb-1">{tooltip.node.label}</p>
          <p className="text-[var(--text-muted)]">
            Type: <span className="text-white capitalize">{tooltip.node.type}</span>
          </p>
          <p className="text-[var(--text-muted)]">
            Transactions: <span className="text-white">{tooltip.node.transactionCount}</span>
          </p>
          <p className="text-[var(--text-muted)]">
            Total: <span className="text-white">₹{tooltip.node.totalAmount.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-[var(--text-muted)]">
            Risk:{' '}
            <span
              className={
                tooltip.node.riskLevel === 'HIGH'
                  ? 'text-red-400'
                  : tooltip.node.riskLevel === 'MEDIUM'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }
            >
              {tooltip.node.riskLevel}
            </span>
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-[2px] bg-red-400" />
          <span className="text-[10px] text-[var(--text-muted)]">Suspicious transfer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-[1px] bg-[#374151] border-dashed" style={{ borderTop: '1px dashed #374151' }} />
          <span className="text-[10px] text-[var(--text-muted)]">Normal transfer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#450a0a] border border-red-500" />
          <span className="text-[10px] text-[var(--text-muted)]">Suspicious node</span>
        </div>
      </div>
    </div>
  );
}
