'use client';

import { useState } from 'react';
import { Gauge } from 'lucide-react';

export default function ValveStatus() {
  const [valveAngle, setValveAngle] = useState(90);
  const [isManual, setIsManual] = useState(false);

  const handleValveChange = (angle: number) => {
    setValveAngle(angle);
    // Send command to backend to control servo motor
    fetch('/api/valve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ angle }),
    }).catch(console.error);
  };

  return (
    <div className="space-y-6">
      {/* Valve Visual */}
      <div className="flex justify-center">
        <div className="relative w-40 h-40 rounded-full border-8 border-slate-300 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div
            className="absolute w-2 h-16 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full origin-center"
            style={{
              transform: `rotate(${valveAngle}deg)`,
              transition: 'transform 0.3s ease-in-out',
            }}
          />
          <Gauge className="w-12 h-12 text-slate-400 absolute" />
        </div>
      </div>

      {/* Valve Angle Display */}
      <div className="text-center">
        <p className="text-sm text-slate-600 mb-2">Current Angle</p>
        <p className="text-3xl font-bold text-cyan-600">{valveAngle}°</p>
      </div>

      {/* Manual Control */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isManual}
            onChange={(e) => setIsManual(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-slate-700">Manual Control</span>
        </label>

        {isManual && (
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="180"
              value={valveAngle}
              onChange={(e) => handleValveChange(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>Closed (0°)</span>
              <span>Open (180°)</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-6 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
        <p className="text-sm text-cyan-900 font-medium">
          Valve is {valveAngle < 45 ? '🔴 Closed' : valveAngle > 135 ? '🟢 Open' : '🟡 Partially Open'}
        </p>
      </div>
    </div>
  );
}
