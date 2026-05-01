"use client";
import React, { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface HoloGlassCardProps {
  children: ReactNode;
  className?: string;
  isCritical?: boolean;
}

export default function HoloGlassCard({ children, className = "", isCritical = false }: HoloGlassCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`relative group bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 ${
        isCritical ? "border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-shake" : "shadow-2xl"
      } ${className}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, ${isCritical ? 'rgba(239,68,68,0.15)' : 'rgba(34,211,238,0.15)'}, transparent 80%)`,
        }}
      />
      
      {/* Glow Border */}
      <div className={`absolute inset-0 border border-white/5 rounded-2xl pointer-events-none ${isCritical ? "border-red-500/30" : "group-hover:border-cyan-500/30 transition-colors duration-500"}`} />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
