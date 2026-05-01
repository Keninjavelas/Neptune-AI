'use client';

import { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';

interface ValveStatusProps {
  recommendedAngle?: number;
  isAutomatic?: boolean;
}

export default function ValveStatus({ recommendedAngle = 180, isAutomatic = false }: ValveStatusProps) {
  const [valveAngle, setValveAngle] = useState(90);
  const [isManual, setIsManual] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(300);

  // Auto-adjust valve when recommended angle changes
  useEffect(() => {
    if (!isManual && recommendedAngle !== undefined && recommendedAngle !== valveAngle) {
      // Longer transition for dramatic leak response
      setTransitionDuration(isAutomatic ? 1000 : 300);
      setValveAngle(recommendedAngle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedAngle, isManual, isAutomatic]);

  const handleValveChange = (angle: number) => {
    setValveAngle(angle);
    setTransitionDuration(300);
    // Send command to backend to control servo motor
    fetch('/api/valve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ angle }),
    }).catch(console.error);
  };

  const getValveStatus = () => {
    if (valveAngle < 45) return '🔴 Closed';
    if (valveAngle > 135) return '🟢 Open';
    return '🟡 Partially Open';
  };

  const getFlowDescription = () => {
    if (valveAngle < 45) return 'Flow blocked';
    if (valveAngle < 90) return 'Flow reduced';
    if (valveAngle < 135) return 'Normal flow';
    return 'Full flow';
  };

  return (
    <div className="space-y-6">
      {/* Valve Visual Gauge */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48 rounded-full border-8 border-slate-300 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner">
          {/* Rotating needle */}
          <div
            className="absolute w-2 h-20 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full origin-center shadow-lg"
            style={{
              transform: `rotate(${valveAngle}deg)`,
              transition: `transform ${transitionDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
            }}
          />

          {/* Center dot */}
          <div className="absolute w-4 h-4 bg-slate-900 rounded-full z-10 shadow-md" />

          {/* Degree markers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Gauge className="w-16 h-16 text-slate-400 opacity-30" />
          </div>
        </div>
      </div>

      {/* Valve Angle Display */}
      <div className="text-center">
        <p className="text-sm text-slate-600 mb-2">Current Angle</p>
        <p className="text-4xl font-bold text-cyan-600 transition-all duration-300">{valveAngle}°</p>
        <p className="text-sm text-slate-600 mt-2">{getFlowDescription()}</p>
      </div>

      {/* Status Indicator */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mb-1">
              Valve Status
            </p>
            <p className="text-lg font-bold text-slate-900">{getValveStatus()}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isAutomatic ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-900'
            }`}
          >
            {isAutomatic ? 'Auto' : 'Manual'}
          </div>
        </div>
      </div>

      {/* Manual Control */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer p-3 hover:bg-slate-50 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={isManual}
            onChange={(e) => setIsManual(e.target.checked)}
            className="w-4 h-4 rounded accent-cyan-600"
          />
          <span className="text-sm font-medium text-slate-700">Manual Control</span>
        </label>

        {isManual && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="range"
              min="0"
              max="180"
              value={valveAngle}
              onChange={(e) => handleValveChange(Number(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Closed (0°)</span>
              <span>50% (90°)</span>
              <span>Open (180°)</span>
            </div>
          </div>
        )}
      </div>

      {/* Auto Info */}
      {!isManual && isAutomatic && (
        <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg">
          <p className="text-xs text-blue-900">
            <span className="font-semibold">🤖 AI Control Active:</span> Valve is being adjusted
            automatically based on flow analysis.
          </p>
        </div>
      )}
    </div>
  );
}
