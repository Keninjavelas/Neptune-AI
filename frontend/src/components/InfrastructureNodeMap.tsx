"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  Cpu,
  Gauge,
  LocateFixed,
  Navigation,
  Radar,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Waves,
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";
import { ensureLeafletSetup } from "@/lib/leafletSetup";
import { useBrowserNodeLocation } from "@/hooks/useBrowserNodeLocation";

const NODE_ID = "ESP32-AQ-01";
const MAP_ZOOM = 16;
const DARK_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO';

type Tone = "normal" | "warning" | "critical" | "offline";

function MapViewport({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), MAP_ZOOM), {
      animate: true,
      duration: 1.2,
    });
  }, [map, center]);

  return null;
}

function formatTelemetryAge(ageMs: number | null) {
  if (ageMs === null) return "--";
  if (ageMs < 1000) return "LIVE";
  return `${Math.round(ageMs / 1000)}s ago`;
}

function formatCoordinate(value: number | null, positive: string, negative: string) {
  if (value === null) return "--";
  const hemisphere = value >= 0 ? positive : negative;
  return `${Math.abs(value).toFixed(5)} ${hemisphere}`;
}

function formatDirectionLabel(distanceMeters: number, heading: number | null) {
  if (distanceMeters < 1) return "CO-LOCATED";
  if (heading === null || Number.isNaN(heading)) return "N/A";
  const headings = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return headings[Math.round(heading / 45) % headings.length];
}

function getTone(systemState: string, isOnline: boolean): Tone {
  if (!isOnline) return "offline";
  if (systemState === "CRITICAL") return "critical";
  if (systemState === "WARNING") return "warning";
  return "normal";
}

function getToneClasses(tone: Tone) {
  switch (tone) {
    case "critical":
      return {
        border: "border-red-500/40",
        label: "text-red-400",
        glow: "shadow-[0_0_40px_rgba(239,68,68,0.18)]",
        badge: "bg-red-500/15 text-red-300 border-red-500/30",
      };
    case "warning":
      return {
        border: "border-amber-500/40",
        label: "text-amber-300",
        glow: "shadow-[0_0_40px_rgba(245,158,11,0.15)]",
        badge: "bg-amber-500/15 text-amber-200 border-amber-500/30",
      };
    case "offline":
      return {
        border: "border-slate-700/70",
        label: "text-slate-400",
        glow: "shadow-[0_0_25px_rgba(15,23,42,0.3)]",
        badge: "bg-slate-800/80 text-slate-300 border-slate-700/60",
      };
    default:
      return {
        border: "border-emerald-500/35",
        label: "text-emerald-300",
        glow: "shadow-[0_0_40px_rgba(16,185,129,0.16)]",
        badge: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
      };
  }
}

export default function InfrastructureNodeMap() {
  const { telemetry, isHardwareActive } = useTelemetry();
  const location = useBrowserNodeLocation();
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const nodePosition = useMemo<[number, number] | null>(() => {
    if (location.latitude === null || location.longitude === null) {
      return null;
    }
    return [location.latitude, location.longitude];
  }, [location.latitude, location.longitude]);

  const telemetryAgeMs =
    typeof telemetry?.lastUpdated === "number" ? Math.max(0, clock - telemetry.lastUpdated) : null;
  const hasLiveTelemetry = Boolean(isHardwareActive && telemetryAgeMs !== null && telemetryAgeMs < 30000);
  const tone = getTone(telemetry.systemState, hasLiveTelemetry);
  const toneClasses = getToneClasses(tone);

  const nodeIcon = useMemo(() => {
    const leaflet = ensureLeafletSetup();
    if (!leaflet) {
      return null;
    }

    return leaflet.divIcon({
      className: "infrastructure-node-icon",
      html: `
        <div class="node-marker-shell node-${tone}">
          <div class="node-marker-ring node-${tone}"></div>
          <div class="node-marker-core node-${tone}">
            <div class="node-marker-heartbeat"></div>
          </div>
        </div>
      `,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
      popupAnchor: [0, -22],
    });
  }, [tone]);

  const pulseFactor = (Math.sin(clock / 550) + 1) / 2;
  const anomalyRadius = 110 + pulseFactor * 90;
  const perimeterRadius = 210 + pulseFactor * 140;
  const operatorDistanceMeters = 0;
  const operatorDirection = formatDirectionLabel(operatorDistanceMeters, location.heading);
  const statusText = hasLiveTelemetry ? "ONLINE" : "OFFLINE";
  const infrastructureState = hasLiveTelemetry ? telemetry.systemState : "OFFLINE";
  const flowRate = hasLiveTelemetry ? telemetry.flowRate : null;
  const riskScore = hasLiveTelemetry ? telemetry.riskScore : null;
  const valveState = hasLiveTelemetry ? telemetry.valveState : "--";

  if (!nodePosition) {
    return (
      <section
        className={`relative overflow-hidden rounded-2xl border bg-slate-900/80 p-6 backdrop-blur-xl ${toneClasses.border} ${toneClasses.glow}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_45%)] pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
              Infrastructure Node Map
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
              Tactical Node Tracking
            </h2>
          </div>
          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            GEOLOCK
          </div>
        </div>

        <div className="relative mt-6 flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/80">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
              <LocateFixed className="h-7 w-7 animate-pulse text-cyan-400" />
            </div>
            <p className="text-lg font-bold text-slate-100">
              {location.loading ? "Requesting live geolocation..." : "Location unavailable"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {location.error ?? "Approve browser location access to render the live node map."}
            </p>
            {!location.loading && (
              <div className="mt-5 flex flex-col items-center gap-3">
                <button
                  onClick={location.retry}
                  className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 transition-colors hover:bg-cyan-500/15"
                >
                  Retry Location Access
                </button>
                <p className="max-w-md text-xs text-slate-600">
                  If you blocked the prompt, enable location permission for this site and reload or
                  retry.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border bg-slate-900/80 p-6 backdrop-blur-xl ${toneClasses.border} ${toneClasses.glow}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_50%)] pointer-events-none" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
              Infrastructure Node Map
            </p>
            <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${toneClasses.badge}`}>
              {statusText}
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
            Live Tactical Infrastructure Tracking
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Browser geolocation is acting as the temporary deployment coordinate for the co-located
            ESP32 infrastructure node while live telemetry drives the tactical state overlays.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Node ID</p>
            <p className="mt-2 text-sm font-black text-cyan-300">{NODE_ID}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">State</p>
            <p className={`mt-2 text-sm font-black ${toneClasses.label}`}>{infrastructureState}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Risk</p>
            <p className="mt-2 text-sm font-black text-white">{riskScore ?? "--"}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Valve</p>
            <p className="mt-2 text-sm font-black text-white">{valveState}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90">
        <div className="absolute inset-x-0 top-0 z-[500] flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/85 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                {NODE_ID}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${hasLiveTelemetry ? "bg-emerald-400" : "bg-slate-500"} ${hasLiveTelemetry ? "animate-pulse" : ""}`} />
              <span className="text-xs font-semibold text-slate-400">{statusText}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-400">
            <span>Heartbeat: {formatTelemetryAge(telemetryAgeMs)}</span>
            <span>Accuracy: {location.accuracy ? `±${Math.round(location.accuracy)}m` : "--"}</span>
            <span>Direction: {operatorDirection}</span>
          </div>
        </div>

        {tone === "critical" && (
          <div className="absolute left-4 top-16 z-[500] rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.15)] backdrop-blur-md">
            Infrastructure Anomaly Detected
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-[520px]">
            <MapContainer
              center={nodePosition}
              zoom={MAP_ZOOM}
              scrollWheelZoom={true}
              className="h-full w-full bg-slate-950"
              zoomControl={false}
            >
              <MapViewport center={nodePosition} />
              <TileLayer attribution={TILE_ATTRIBUTION} url={DARK_TILE_URL} />

              <Circle
                center={nodePosition}
                radius={22}
                pathOptions={{
                  color: tone === "critical" ? "#ef4444" : tone === "warning" ? "#f59e0b" : "#10b981",
                  fillColor: tone === "critical" ? "#ef4444" : tone === "warning" ? "#f59e0b" : "#10b981",
                  fillOpacity: 0.22,
                  weight: 1,
                }}
              />

              {tone !== "offline" && (
                <Circle
                  center={nodePosition}
                  radius={tone === "critical" ? anomalyRadius : 70 + pulseFactor * 30}
                  pathOptions={{
                    color: tone === "critical" ? "#ef4444" : tone === "warning" ? "#f59e0b" : "#34d399",
                    fillColor: tone === "critical" ? "#ef4444" : tone === "warning" ? "#f59e0b" : "#10b981",
                    fillOpacity: tone === "critical" ? 0.08 : 0.05,
                    weight: 1.5,
                  }}
                />
              )}

              {tone === "critical" && (
                <Circle
                  center={nodePosition}
                  radius={perimeterRadius}
                  pathOptions={{
                    color: "#ef4444",
                    fillColor: "#ef4444",
                    fillOpacity: 0.03,
                    dashArray: "8 12",
                    weight: 1.25,
                  }}
                />
              )}

              {nodeIcon && (
                <Marker position={nodePosition} icon={nodeIcon}>
                  <Popup className="infrastructure-popup" closeButton={false}>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Edge Node
                        </p>
                        <h3 className="text-base font-black text-white">{NODE_ID}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-slate-500">STATUS</p>
                          <p className="font-bold text-emerald-300">{statusText}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">STATE</p>
                          <p className={`font-bold ${toneClasses.label}`}>{infrastructureState}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">FLOW</p>
                          <p className="font-bold text-cyan-300">
                            {flowRate !== null ? `${flowRate.toFixed(1)} L/min` : "--"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">RISK</p>
                          <p className="font-bold text-white">{riskScore ?? "--"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-slate-500">VALVE</p>
                          <p className="font-bold text-white">{valveState}</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          <div className="border-l border-slate-800 bg-slate-950/95 p-4">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center gap-2">
                  <Radar className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-200">
                    Node Telemetry
                  </h3>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Flow</p>
                    <p className="mt-2 font-black text-cyan-300">
                      {flowRate !== null ? `${flowRate.toFixed(1)} L/min` : "--"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Risk</p>
                    <p className="mt-2 font-black text-white">{riskScore ?? "--"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Valve</p>
                    <p className="mt-2 font-black text-white">{valveState}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Uplink</p>
                    <p className="mt-2 font-black text-white">
                      {hasLiveTelemetry ? `${telemetry.latency ?? "--"} ms` : "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-200">
                    Positioning
                  </h3>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">Latitude</span>
                    <span className="font-mono">{formatCoordinate(location.latitude, "N", "S")}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">Longitude</span>
                    <span className="font-mono">{formatCoordinate(location.longitude, "E", "W")}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">Operator Range</span>
                    <span className="font-semibold">
                      {operatorDistanceMeters.toFixed(0)} m / {operatorDirection}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">Fix Updated</span>
                    <span className="font-semibold">
                      {location.lastUpdated ? new Date(location.lastUpdated).toLocaleTimeString() : "--"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center gap-2">
                  {tone === "critical" ? (
                    <ShieldAlert className="h-4 w-4 text-red-400" />
                  ) : tone === "warning" ? (
                    <TriangleAlert className="h-4 w-4 text-amber-300" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  )}
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-200">
                    Infrastructure State
                  </h3>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Current State</span>
                    <span className={`font-black ${toneClasses.label}`}>{infrastructureState}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Heartbeat</span>
                    <span className="font-semibold text-slate-300">{formatTelemetryAge(telemetryAgeMs)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Containment Radius</span>
                    <span className="font-semibold text-slate-300">
                      {tone === "critical" ? `${Math.round(perimeterRadius)} m` : "Standby"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-slate-400">
                    <div className="mb-2 flex items-center gap-2 text-slate-300">
                      <Waves className="h-4 w-4 text-cyan-400" />
                      <Gauge className="h-4 w-4 text-cyan-400" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                        Tactical Assessment
                      </span>
                    </div>
                    {hasLiveTelemetry
                      ? `Live ESP32 telemetry is synchronized to the node marker. Tactical pulse color, anomaly radius, and status overlays are being driven by the incoming infrastructure state.`
                      : `Awaiting live ESP32 telemetry. The map is locked to the browser-derived deployment coordinate, but tactical status overlays remain offline until the node uplink is active.`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
