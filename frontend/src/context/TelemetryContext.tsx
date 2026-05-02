"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";
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

  // 3. Local mode tracking keeps the UI responsive even when the hardware
  // packet does not immediately echo the current authority mode.
  const [localManualMode, setLocalManualMode] = React.useState(false);

  useEffect(() => {
    if (typeof hw.telemetry?.isManual === "boolean") {
      setLocalManualMode(hw.telemetry.isManual);
    }
  }, [hw.telemetry?.isManual]);

  // 4. Dynamic Data Selection (Single Source of Truth)
  const activeTelemetry = useMemo(() => {
    // If live hardware is enabled AND we have a packet
    if (USE_LIVE_HARDWARE && hw.telemetry) {
      return {
        ...sim.telemetry,
        ...hw.telemetry,
        // Prefer the locally requested mode until hardware confirms otherwise.
        isManual: localManualMode
      };
    }
    // Otherwise fallback to simulation
    return sim.telemetry;
  }, [hw.telemetry, sim.telemetry, localManualMode]);

  // Combined logs
  const activeLogs = useMemo(() => {
    return sim.logs;
  }, [sim.logs]);

  const triggerAnomaly = (type?: string) => {
    if (USE_LIVE_HARDWARE && hw.isHardwareConnected) {
      hw.sendCommand("SIMULATE_ANOMALY");
    } else {
      sim.triggerAnomaly(type);
    }
  };

  const resetSystem = () => {
    if (USE_LIVE_HARDWARE && hw.isHardwareConnected) {
      hw.sendCommand("RESET_SYSTEM");
      setLocalManualMode(false);
    } else {
      sim.resetSystem();
    }
  };

  const setIsManual = (val: boolean) => {
    if (USE_LIVE_HARDWARE && hw.isHardwareConnected) {
      if (val === localManualMode) {
        return;
      }
      hw.sendCommand("MANUAL_OVERRIDE");
      // Update local state so UI reflects the toggle immediately.
      setLocalManualMode(val);
    } else {
      sim.setIsManual(val);
    }
  };

  const setValveAngle = (angle: number) => {
    if (USE_LIVE_HARDWARE && hw.isHardwareConnected) {
      // Send specific angle command to ESP32
      hw.sendCommand(`VALVE_ANGLE_${Math.round(angle)}`);
      // When adjusting valve, we usually enter manual mode
      setLocalManualMode(true);
    } else {
      sim.setValveAngle(angle);
    }
  };

  return (
    <TelemetryContext.Provider value={{ 
      telemetry: activeTelemetry, 
      logs: activeLogs, 
      setIsManual, 
      setValveAngle, 
      triggerAnomaly, 
      resetSystem,
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
