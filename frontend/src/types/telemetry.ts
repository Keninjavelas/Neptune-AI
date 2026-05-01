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
  flowRate: number;
  tds: number;
  riskScore: number;
  valveAngle: number;
  valveState: ValveState;
  anomalyLevel: AnomalyLevel;
  telemetryStatus: TelemetryStatus;
  relayState: boolean;
  systemHealth: number;
  tankLevel: number;
  stabilityScore: number;
  alerts: number;
  isManual: boolean;
  status?: string;
  lastUpdated: number;
}
