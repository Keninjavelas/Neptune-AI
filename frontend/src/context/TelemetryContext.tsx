"use client";
import React, { createContext, useContext, useMemo } from "react";
import { 
  TelemetryPacket, 
  TelemetryLog 
} from "../types/telemetry";
import { useSimulationEngine } from "../hooks/useSimulationEngine";
import { useHardwareTelemetry } from "../hooks/useHardwareTelemetry";

// Toggle this to switch between simulated and real hardware bridge data
const USE_LIVE_HARDWARE = true;

interface TelemetryContextType {
  telemetry: TelemetryPacket;
  logs: TelemetryLog[];
  setIsManual: (val: boolean) => void;
  setValveAngle: (angle: number) => void;
  triggerAnomaly: (type?: string) => void;
  resetSystem: () => void;
  isHardwareActive: boolean;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  // 1. Simulation Engine (Local)
  const sim = useSimulationEngine({
    nodeId: "PRIMARY_CORE",
    updateInterval: 1000,
    anomalyProbability: 0.95
  });

  // 2. Hardware Bridge (WebSocket)
  const hw = useHardwareTelemetry();

  // 3. Dynamic Data Selection (Single Source of Truth)
  const activeTelemetry = useMemo(() => {
    // If live hardware is enabled AND we have a packet, it's the absolute truth.
    if (USE_LIVE_HARDWARE && hw.telemetry) {
      return hw.telemetry;
    }
    // Otherwise fallback to simulation
    return sim.telemetry;
  }, [hw.telemetry, sim.telemetry]);

  // Combined logs
  const activeLogs = useMemo(() => {
    // If hardware is active and has logs, we could potentially merge them
    // For now, keeping sim logs for UI consistency as per Phase 2 requirements
    return sim.logs;
  }, [sim.logs]);

  return (
    <TelemetryContext.Provider value={{ 
      telemetry: activeTelemetry, 
      logs: activeLogs, 
      setIsManual: sim.setIsManual, 
      setValveAngle: sim.setValveAngle, 
      triggerAnomaly: sim.triggerAnomaly, 
      resetSystem: sim.resetSystem,
      isHardwareActive: USE_LIVE_HARDWARE && hw.isHardwareConnected
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (context === undefined) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
}
