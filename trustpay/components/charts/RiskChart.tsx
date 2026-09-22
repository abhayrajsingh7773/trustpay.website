'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { DailyRiskDataPoint } from '@/lib/types';

interface RiskChartProps {
  data: DailyRiskDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[12px]">
      <p className="text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-red-400 font-medium">Risk: {payload[0]?.value}</p>
      <p className="text-blue-400">Txns: {payload[1]?.value}</p>
    </div>
  );
};

export default function RiskChart({ data }: RiskChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="txnGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#1f1f26" />
        <XAxis
          dataKey="day"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="riskScore"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#riskGrad)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="transactions"
          stroke="#3b82f6"
          strokeWidth={1.5}
          fill="url(#txnGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
