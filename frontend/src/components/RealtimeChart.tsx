'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface RealtimeChartProps {
  data: number[];
  anomalyStatus?: 'normal' | 'warning' | 'critical';
}

export default function RealtimeChart({ data, anomalyStatus = 'normal' }: RealtimeChartProps) {
  const chartData = data.map((flow, idx) => ({
    time: idx,
    flow,
  }));

  const getLineColor = () => {
    if (anomalyStatus === 'critical') return '#dc2626';
    if (anomalyStatus === 'warning') return '#f59e0b';
    return '#06b6d4';
  };

  const getGradientId = `gradient-${anomalyStatus}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id={getGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getLineColor()} stopOpacity={0.3} />
            <stop offset="95%" stopColor={getLineColor()} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          label={{ value: 'L/min', angle: -90, position: 'insideLeft' }}
          domain={[0, 10]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: 'none',
            borderRadius: '8px',
            color: '#f3f4f6',
          }}
          labelStyle={{ color: '#f3f4f6' }}
          formatter={(value: any) => [
            typeof value === 'number' ? value.toFixed(2) : value,
            'Flow Rate',
          ]}
        />
        {/* Normal flow reference line */}
        <ReferenceLine
          y={5.0}
          stroke="#9ca3af"
          strokeDasharray="5 5"
          label={{ value: 'Expected (5.0)', position: 'right', fill: '#6b7280', fontSize: 12 }}
        />
        {/* Leak threshold */}
        <ReferenceLine
          y={3.0}
          stroke="#dc2626"
          strokeDasharray="5 5"
          label={{ value: 'Leak Alert', position: 'right', fill: '#dc2626', fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="flow"
          stroke={getLineColor()}
          strokeWidth={3}
          dot={false}
          isAnimationActive={true}
          fill={`url(#${getGradientId})`}
          animationDuration={400}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
