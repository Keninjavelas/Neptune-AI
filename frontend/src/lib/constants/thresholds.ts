/**
 * Safety Envelopes for Neptune AI Smart Water Infrastructure
 * Centralized thresholds for visual reactivity and logic.
 */

export const THRESHOLDS = {
  FLOW_RATE: {
    MIN_SAFE: 2.0,
    MAX_SAFE: 8.0,
    CRITICAL_LOW: 1.0,
    CRITICAL_HIGH: 10.0,
    UNIT: "L/M",
  },
  TDS: {
    SAFE: 150,
    WARNING: 300,
    CRITICAL: 450,
    UNIT: "PPM",
  },
  RISK_SCORE: {
    LOW: 20,
    MEDIUM: 50,
    HIGH: 75,
    UNIT: "%",
  },
  TANK_LEVEL: {
    LOW: 30,
    CRITICAL: 15,
    UNIT: "%",
  },
  SYSTEM_HEALTH: {
    WARNING: 80,
    CRITICAL: 60,
    UNIT: "%",
  },
  STABILITY_SCORE: {
    WARNING: 90,
    CRITICAL: 75,
    UNIT: "%",
  }
};

export type ThresholdType = typeof THRESHOLDS;
