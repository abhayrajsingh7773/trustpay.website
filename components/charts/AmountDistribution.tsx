'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { AmountDataPoint } from '@/lib/types';

interface AmountDistributionProps {
  data: AmountDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-[12px]">
      <p className="text-[var(--text-muted)] mb-0.5">{label}</p>
      <p className="text-white font-medium">{payload[0]?.value} transactions</p>
    </div>
  );
};

export default function AmountDistribution({ data }: AmountDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={18}>
        <CartesianGrid vertical={false} stroke="#1f1f26" />
        <XAxis
          dataKey="range"
          tick={{ fill: '#6b7280', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239,68,68,0.05)' }} />
        <Bar dataKey="count" fill="#ef4444" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
