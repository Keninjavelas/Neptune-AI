"use client";
import { useSimulationEngine } from "./useSimulationEngine";

/**
 * Enterprise-Grade Neptune AI Telemetry Engine (Refactored to use Simulation Engine)
 * Optimized for infrastructure monitoring simulation.
 */
export default function useMockTelemetry(initialFlow = 5.4) {
  const {
    telemetry,
    logs,
    setIsManual,
    setValveAngle,
    triggerAnomaly,
    resetSystem
  } = useSimulationEngine({
    nodeId: "MOCK_GATEWAY",
    updateInterval: 2000,
  });

  const {
    flowRate,
    tankLevel,
    tds,
    valveAngle,
    isManual,
    alerts,
    anomalyLevel,
    riskScore,
    stabilityScore
  } = telemetry;

  // Derive wqi and status for backward compatibility
  const wqi = 100 - (riskScore * 0.5);
  const status = anomalyLevel === 2 ? "critical" : "online";

  return {
    flow: flowRate,
    tankLevel,
    tdsValue: tds,
    valveAngle,
    isManual,
    alerts,
    status,
    logs,
    riskScore,
    wqi,
    stabilityScore,
    setIsManual,
    setValveAngle,
    resetAlerts: resetSystem,
    triggerAnomaly // New method available if needed
  };
}
