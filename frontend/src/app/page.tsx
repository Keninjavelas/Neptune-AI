'use client';

import { useEffect, useState } from 'react';
import { Droplet, AlertTriangle, Zap } from 'lucide-react';
import RealtimeChart from '@/components/RealtimeChart';
import ValveStatus from '@/components/ValveStatus';
import AlertsFeed from '@/components/AlertsFeed';

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [flowData, setFlowData] = useState<number[]>([]);
  const [latestReading, setLatestReading] = useState<number>(0);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onopen = () => {
      console.log('Connected to backend');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.channel === 'telemetry') {
        setLatestReading(message.data.data.flow);
        setFlowData((prev) => [...prev.slice(-59), message.data.data.flow]);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Droplet className="w-8 h-8 text-cyan-600" />
            <h1 className="text-4xl font-bold text-slate-900">AquaFlow AI</h1>
          </div>
          <p className="text-slate-600">Smart Water Leak Detection & Automatic Response</p>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">System Status</p>
                <p className="text-2xl font-bold text-slate-900">
                  {isConnected ? '🟢 Online' : '🔴 Offline'}
                </p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Current Flow</p>
                <p className="text-2xl font-bold text-slate-900">{latestReading.toFixed(1)} L/min</p>
              </div>
              <Droplet className="w-8 h-8 text-cyan-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Alerts</p>
                <p className="text-2xl font-bold text-slate-900">{alerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flow Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Water Flow Rate (Real-time)</h2>
            <RealtimeChart data={flowData} />
          </div>

          {/* Valve Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Valve Control</h2>
            <ValveStatus />
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">System Alerts</h2>
          <AlertsFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
