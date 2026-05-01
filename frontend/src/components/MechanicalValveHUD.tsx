"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface ValveHUDProps {
  angle: number;
  isCritical: boolean;
}

export default function MechanicalValveHUD({ angle, isCritical }: ValveHUDProps) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Dashed Ring - Clockwise */}
      <motion.div
        className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Middle Dashed Ring - Counter-Clockwise */}
      <motion.div
        className="absolute inset-4 border border-dashed border-cyan-400/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Main SVG Gauge */}
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 -rotate-90">
        <defs>
          <filter id="hud-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background Track */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />

        {/* Active Angle Indicator */}
        <motion.path
          d={`M 100 20 A 80 80 0 ${angle > 180 ? 1 : 0} 1 ${100 + 80 * Math.sin((angle * Math.PI) / 180)} ${100 - 80 * Math.cos((angle * Math.PI) / 180)}`}
          fill="none"
          stroke={isCritical ? "#ef4444" : "#22d3ee"}
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#hud-glow)"
          initial={false}
          animate={{ d: describeArc(100, 100, 80, 0, angle) }}
        />

        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 70 * Math.sin((angle * Math.PI) / 180)}
          stroke={isCritical ? "#ef4444" : "#ffffff"}
          strokeWidth="2"
          animate={{ rotate: angle }}
          style={{ originX: "100px", originY: "100px" }}
        />
      </svg>

      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className={`text-4xl font-mono font-black ${isCritical ? "text-red-500" : "text-white"}`}>
          {angle}°
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">Valve Pos</span>
      </div>
    </div>
  );
}

// Helper to describe SVG arc
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
