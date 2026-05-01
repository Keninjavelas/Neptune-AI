'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RealtimeChartProps {
  data: number[];
}

export default function RealtimeChart({ data }: RealtimeChartProps) {
  const chartData = data.map((flow, idx) => ({
    time: idx,
    flow,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" stroke="#6b7280" />
        <YAxis stroke="#6b7280" label={{ value: 'L/min', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#f3f4f6' }}
        />
        <Line
          type="monotone"
          dataKey="flow"
          stroke="#06b6d4"
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
