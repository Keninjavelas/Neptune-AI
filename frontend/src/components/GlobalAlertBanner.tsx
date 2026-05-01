"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface GlobalAlertBannerProps {
  systemState: string;
}

export default function GlobalAlertBanner({ systemState }: GlobalAlertBannerProps) {
  const isCritical = systemState === "CRITICAL";

  return (
    <AnimatePresence>
      {isCritical && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="fixed top-0 left-0 right-0 z-[100] h-12 flex items-center justify-center overflow-hidden"
        >
          {/* Hazard Striped Background */}
          <div className="absolute inset-0 bg-red-600">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, black 20px, black 40px)`,
                backgroundSize: '200% 200%'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative flex items-center gap-6 px-8">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-2"
            >
              <ShieldAlert className="text-white" size={20} />
              <span className="text-sm font-black text-white uppercase tracking-[0.2em]">
                CRITICAL EVENT DETECTED
              </span>
            </motion.div>

            <div className="w-[1px] h-6 bg-white/30" />

            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-300 animate-pulse" size={18} />
              <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
                AI Autonomous Mitigation Active // Flow Instability in Sector 7
              </p>
            </div>

            <div className="w-[1px] h-6 bg-white/30" />

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white/70 uppercase tracking-tighter">
                Authority: AI_CORE
              </span>
            </div>
          </div>

          {/* Bottom Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.8)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
