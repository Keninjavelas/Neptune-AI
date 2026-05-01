export type LogSource = "INFO" | "AI" | "WARN" | "CTRL" | "ALERT" | "SAFE";

export interface TelemetryLog {
  id: string;
  ts: number;
  source: LogSource;
  message: string;
}

export type ValveState = "OPEN" | "PARTIAL" | "CLOSED";
export type AnomalyLevel = 0 | 1 | 2; // 0: Nominal, 1: Warning, 2: Critical
export type TelemetryStatus = "stable" | "unstable" | "interrupted";

export interface TelemetryPacket {
  // Core telemetry (Atomic Source of Truth)
  flowRate: number;
  tds: number;
  riskScore: number;
  systemState: string; // "NORMAL", "WARNING", "CRITICAL"
  valveState: ValveState;
  relayState: boolean;
  buzzerState?: boolean;
  anomalyCount?: number;
  uptime?: number;
  stability?: number;
  latency?: number;

  // UI / Legacy Compatibility
  valveAngle: number;
  anomalyLevel: AnomalyLevel;
  telemetryStatus: TelemetryStatus;
  systemHealth: number;
  tankLevel: number;
  stabilityScore: number;
  alerts: number;
  isManual: boolean;
  status?: string;
  lastUpdated: number;
}
