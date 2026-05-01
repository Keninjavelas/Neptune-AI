/**
 * Anomaly Detection Engine for AquaFlow AI
 * Lightweight, threshold-based leak detection without heavy ML
 */

export interface AnomalyResult {
  isAnomaly: boolean;
  leakProbability: number; // 0-100
  severity: 'normal' | 'warning' | 'critical';
  reason: string;
  recommendedValveAngle: number; // 0-180
}

export class AnomalyDetector {
  private readonly NORMAL_FLOW_MIN = 4.5; // L/min
  private readonly NORMAL_FLOW_MAX = 5.5; // L/min
  private readonly EXPECTED_FLOW = 5.0;
  private readonly LEAK_THRESHOLD = 3.0; // Drop below this = leak
  private readonly BLOCKAGE_THRESHOLD = 7.0; // Rise above this = blockage
  private readonly CRITICAL_FLOW = 2.0; // Severe leak

  private flowHistory: number[] = [];
  private readonly historySize = 10; // Last 10 readings
  private readonly CONFIDENCE_THRESHOLD = 0.6; // 60% confidence before alert

  /**
   * Analyze flow data for anomalies
   */
  analyze(currentFlow: number): AnomalyResult {
    // Add to history
    this.flowHistory.push(currentFlow);
    if (this.flowHistory.length > this.historySize) {
      this.flowHistory.shift();
    }

    // Calculate statistics
    const avgFlow = this.getMovingAverage(5);
    const flowDeviation = Math.abs(currentFlow - this.EXPECTED_FLOW) / this.EXPECTED_FLOW;
    const deltaFlow = this.flowHistory.length >= 2 
      ? this.flowHistory[this.flowHistory.length - 1] - this.flowHistory[this.flowHistory.length - 2]
      : 0;
    const recentTrend = this.getRecentTrend();

    // Detect anomalies
    let leakProbability = 0;
    let severity: AnomalyResult['severity'] = 'normal';
    let reason = 'System operating normally';
    let recommendedValveAngle = 180; // Open

    // ============ LEAK DETECTION ============
    if (currentFlow < this.LEAK_THRESHOLD) {
      leakProbability = Math.min(100, 50 + (this.LEAK_THRESHOLD - currentFlow) * 20);
      severity = currentFlow < this.CRITICAL_FLOW ? 'critical' : 'warning';
      reason = `Flow critically low: ${currentFlow.toFixed(1)} L/min`;
      
      // Auto-reduce valve
      if (severity === 'critical') {
        recommendedValveAngle = 30; // Close significantly
      } else {
        recommendedValveAngle = 60; // Partially close
      }
    }
    // ============ SUDDEN DROP DETECTION ============
    else if (deltaFlow < -0.8 && currentFlow < avgFlow) {
      leakProbability = Math.min(100, 40 + Math.abs(deltaFlow) * 30);
      severity = 'warning';
      reason = `Sudden flow drop: ${Math.abs(deltaFlow).toFixed(2)} L/min`;
      recommendedValveAngle = 90; // Reduce flow moderately
    }
    // ============ SUSTAINED LOW FLOW ============
    else if (avgFlow < this.NORMAL_FLOW_MIN && currentFlow < this.NORMAL_FLOW_MIN) {
      leakProbability = Math.min(100, 30 + (this.NORMAL_FLOW_MIN - avgFlow) * 20);
      severity = 'warning';
      reason = `Sustained low flow: ${avgFlow.toFixed(1)} L/min average`;
      recommendedValveAngle = 100;
    }
    // ============ BLOCKAGE DETECTION ============
    else if (currentFlow > this.BLOCKAGE_THRESHOLD) {
      leakProbability = 20; // Not a leak, but an issue
      severity = 'warning';
      reason = `Possible blockage: ${currentFlow.toFixed(1)} L/min`;
      recommendedValveAngle = 120; // Increase flow
    }
    // ============ NORMAL OPERATION ============
    else {
      leakProbability = Math.max(0, (flowDeviation - 0.05) * 100);
      severity = 'normal';
      reason = 'System operating normally';
      recommendedValveAngle = 180; // Fully open
    }

    // Only treat as anomaly if probability exceeds threshold
    const isAnomaly = leakProbability >= this.CONFIDENCE_THRESHOLD * 100;

    return {
      isAnomaly,
      leakProbability: Math.round(leakProbability),
      severity: isAnomaly ? severity : 'normal',
      reason,
      recommendedValveAngle,
    };
  }

  /**
   * Get moving average of last N readings
   */
  private getMovingAverage(windowSize: number): number {
    const window = this.flowHistory.slice(-windowSize);
    if (window.length === 0) return this.EXPECTED_FLOW;
    return window.reduce((a, b) => a + b, 0) / window.length;
  }

  /**
   * Get trend direction (positive = increasing, negative = decreasing)
   */
  private getRecentTrend(): number {
    if (this.flowHistory.length < 3) return 0;
    const recent = this.flowHistory.slice(-3);
    return (recent[2] - recent[0]) / 2; // Simple linear trend
  }

  /**
   * Reset history (useful when test data is injected)
   */
  reset(): void {
    this.flowHistory = [];
  }

  /**
   * Get history for debug/visualization
   */
  getHistory(): number[] {
    return [...this.flowHistory];
  }
}

// Singleton instance
export const anomalyDetector = new AnomalyDetector();
