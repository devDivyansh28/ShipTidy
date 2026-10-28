"use client";

import React, { useRef, useState, useMemo } from "react";

// Authentic GitHub Contribution Heatmap Colors
const HEATMAP_COLORS = [
  "#161b22", // Level 0: empty
  "#0e4429", // Level 1: low
  "#006d32", // Level 2: medium
  "#26a641", // Level 3: high
  "#39d353", // Level 4: intense
  "#56f076", // Highlight pulse
];

interface Cell {
  x: number;
  y: number;
  baseColor: string;
  level: number;
}

// Deterministic pseudo-random distribution based on coordinates
function getCellLevel(r: number, c: number): number {
  const hash = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
  const val = hash - Math.floor(hash);

  if (val > 0.95) return 4;
  if (val > 0.85) return 3;
  if (val > 0.65) return 2;
  if (val > 0.40) return 1;
  return 0;
}

export function HeatmapText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Grid dimensions for 1000x440 viewport
  // Cell size: 8.5px, Gap: 3px -> Step: 11.5px
  const cells = useMemo(() => {
    const width = 1000;
    const height = 440;
    const step = 11.5;
    const marginX = 20;
    const marginY = 20;

    const numCols = Math.floor((width - marginX * 2) / step);
    const numRows = Math.floor((height - marginY * 2) / step);

    const generatedCells: Cell[] = [];

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const level = getCellLevel(r, c);
        generatedCells.push({
          x: marginX + c * step,
          y: marginY + r * step,
          baseColor: HEATMAP_COLORS[level],
          level,
        });
      }
    }

    return generatedCells;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 440;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center select-none"
    >
      {/* Ambient green glow behind the text */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(38, 166, 65, 0.28) 0%, rgba(14, 68, 41, 0.12) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Accessible headline for screen readers */}
      <h1 className="sr-only">ShipTidy Code Review</h1>

      {/* Main SVG Render */}
      <svg
        viewBox="0 0 1000 440"
        className="w-full h-auto max-w-4xl cursor-crosshair relative z-10 transition-transform duration-300 drop-shadow-[0_0_25px_rgba(38,166,65,0.2)]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* Mask matching the bold typographic styling */}
          <mask id="heatmap-text-mask">
            <rect width="1000" height="440" fill="black" />
            {/* Line 1: ShipTidy */}
            <text
              x="500"
              y="185"
              textAnchor="middle"
              className="font-sans font-black tracking-tight"
              fontSize="165"
              fill="white"
            >
              ShipTidy
            </text>
            {/* Line 2: Code Review */}
            <text
              x="500"
              y="370"
              textAnchor="middle"
              className="font-sans font-black tracking-tight"
              fontSize="165"
              fill="white"
            >
              Code Review
            </text>
          </mask>
        </defs>

        {/* The Grid of Heatmap Contribution Blocks */}
        <g mask="url(#heatmap-text-mask)">
          {cells.map((cell, idx) => {
            let fillColor = cell.baseColor;
            let opacity = 0.9;

            if (mousePos) {
              const dx = cell.x - mousePos.x;
              const dy = cell.y - mousePos.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 45) {
                // Interactive cursor highlight
                fillColor = HEATMAP_COLORS[5];
                opacity = 1;
              } else if (dist < 85) {
                fillColor = HEATMAP_COLORS[4];
                opacity = 1;
              } else if (dist < 130 && cell.level > 0) {
                fillColor = HEATMAP_COLORS[3];
              }
            }

            return (
              <rect
                key={idx}
                x={cell.x}
                y={cell.y}
                width="8.5"
                height="8.5"
                rx="2"
                ry="2"
                fill={fillColor}
                opacity={opacity}
                className="transition-colors duration-150"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
