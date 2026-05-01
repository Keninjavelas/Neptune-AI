"use client";
import { useEffect, useRef, useState } from "react";

export type TelemetryLog = {
  id: string;
  ts: number;
  source: "SYS" | "AI_CORE" | "ALERT";
  message: string;
};

export default function useMockTelemetry(initialFlow = 4.2) {
  const [flow, setFlow] = useState<number>(initialFlow);
  const [valveAngle, setValveAngle] = useState<number>(90);
  const [alerts, setAlerts] = useState<number>(0);
  const [status, setStatus] = useState<"online" | "offline">("online");
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // helper to push log
  const pushLog = (source: TelemetryLog['source'], message: string) => {
    const entry: TelemetryLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      source,
      message,
    };
    setLogs((s) => {
      const next = [...s, entry].slice(-200);
      return next;
    });
  };

  useEffect(() => {
    // initial warmup logs
    pushLog("SYS", "Telemetry bridge initialized (ESP32 simulated)");
    pushLog("AI_CORE", "AI inference module online — monitoring baseline");

    const iv = setInterval(() => {
      // small sinusoidal + noise variation
      const noise = (Math.random() - 0.5) * 0.25;
      const delta = Math.sin(Date.now() / 2000) * 0.15 + noise;
      let nextFlow = Math.max(0.2, +(flow + delta).toFixed(3));

      // occasional anomaly
      if (Math.random() < 0.08) {
        // anomaly burst
        const drop = +(Math.random() * 2 + 1).toFixed(2);
        nextFlow = Math.max(0.05, +(nextFlow - drop).toFixed(3));
        pushLog("ALERT", `Rapid flow drop detected: ${nextFlow.toFixed(2)} L/min`);
        pushLog("AI_CORE", `Anomaly classifier: probable leak (p=${Math.round(Math.random()*30+70)}%)`);
        setAlerts((a) => Math.min(99, a + 1));
        setValveAngle((v) => Math.max(10, v - Math.round(Math.random() * 50)));
        setStatus("online");
      } else {
        // gentle drift back towards baseline 4.2
        nextFlow = +(nextFlow + (4.2 - nextFlow) * 0.02).toFixed(3);
      }

      // occasionally flip offline/online
      if (Math.random() < 0.01) {
        setStatus((s) => {
          const ns = s === "online" ? "offline" : "online";
          pushLog("SYS", `Connection ${ns.toUpperCase()}`);
          return ns;
        });
      }

      // small valve auto adjustments when not manual
      setValveAngle((v) => {
        const adj = (Math.random() - 0.5) * 2; // -1..1
        return Math.min(180, Math.max(0, Math.round(v + adj)));
      });

      if (mounted.current) setFlow(nextFlow);
    }, 2000);

    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow]);

  // public API
  const clearAlerts = () => setAlerts(0);
  const pushManualLog = (msg: string) => pushLog("SYS", msg);

  return {
    flow,
    valveAngle,
    alerts,
    status,
    logs,
    pushLog: pushManualLog,
    clearAlerts,
    setValveAngle,
  } as const;
}
