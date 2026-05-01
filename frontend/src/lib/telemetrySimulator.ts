/**
 * Mock Telemetry Simulator for AquaFlow AI
 * Generates realistic water flow data with periodic leak simulations
 */

export interface TelemetryData {
  timestamp: number;
  flow: number; // L/min
  pressure: number; // kPa
  temperature: number; // °C
}

export class TelemetrySimulator {
  private baseFlow = 5.0; // L/min
  private flowVariance = 0.2; // Natural variance
  private isSimulatingLeak = false;
  private leakIntensity = 0; // 0 to 1
  private leakStartTime = 0;
  private normalFlowRecoveryTime = 15000; // 15 seconds to recover

  /**
   * Generate realistic telemetry data
   */
  generateTelemetry(): TelemetryData {
    const now = Date.now();
    
    // Natural flow fluctuation
    const naturalVariance = (Math.random() - 0.5) * this.flowVariance;
    
    // Leak simulation
    let leakFactor = 1.0;
    if (this.isSimulatingLeak) {
      const elapsed = now - this.leakStartTime;
      const leakDuration = 10000; // 10 second leak period
      
      if (elapsed < leakDuration) {
        // Leak gets progressively worse for 10 seconds
        this.leakIntensity = (elapsed / leakDuration) * 0.8; // Up to 80% reduction
      } else if (elapsed < leakDuration + this.normalFlowRecoveryTime) {
        // Then gradually recovers
        const recoveryProgress = (elapsed - leakDuration) / this.normalFlowRecoveryTime;
        this.leakIntensity = Math.max(0, 0.8 * (1 - recoveryProgress));
      } else {
        // Leak resolved
        this.isSimulatingLeak = false;
        this.leakIntensity = 0;
      }
      
      leakFactor = 1.0 - this.leakIntensity;
    }

    const flow = Math.max(
      0.1,
      (this.baseFlow + naturalVariance) * leakFactor + (Math.random() - 0.5) * 0.1
    );

    return {
      timestamp: now,
      flow: Math.round(flow * 100) / 100, // Round to 2 decimals
      pressure: 2.5 + (Math.random() - 0.5) * 0.2, // 2.3 - 2.7 kPa
      temperature: 22 + (Math.random() - 0.5) * 2, // 21 - 23°C
    };
  }

  /**
   * Start simulating a leak event
   */
  simulateLeak(): void {
    this.isSimulatingLeak = true;
    this.leakStartTime = Date.now();
    this.leakIntensity = 0;
  }

  /**
   * Reset to normal operation
   */
  reset(): void {
    this.isSimulatingLeak = false;
    this.leakIntensity = 0;
  }

  /**
   * Check if currently simulating a leak
   */
  isLeakActive(): boolean {
    return this.isSimulatingLeak;
  }

  /**
   * Get current leak intensity (0-1)
   */
  getLeakIntensity(): number {
    return this.leakIntensity;
  }
}

// Singleton instance
export const telemetrySimulator = new TelemetrySimulator();
