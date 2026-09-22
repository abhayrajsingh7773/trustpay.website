'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import type { HourlyDataPoint } from '@/lib/types';

interface HourlyChartProps {
  data: HourlyDataPoint[];
  peakHours?: number[];
}

export default function HourlyChart({ data, peakHours = [9, 12, 19, 21] }: HourlyChartProps) {
  const getHourNum = (h: string) => {
    const [num, period] = [h.replace(/AM|PM/, ''), h.includes('PM') ? 'PM' : 'AM'];
    let n = parseInt(num);
    if (period === 'PM' && n !== 12) n += 12;
    if (period === 'AM' && n === 12) n = 0;
    return n;
  };

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={10}>
        <CartesianGrid vertical={false} stroke="#1f1f26" />
        <XAxis
          dataKey="hour"
          tick={{ fill: '#6b7280', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          content={({ active, payload, label }: any) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="card px-3 py-2 text-[12px]">
                <p className="text-[var(--text-muted)]">{label}</p>
                <p className="text-white font-medium">{payload[0]?.value} transactions</p>
              </div>
            );
          }}
        />
        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
          {data.map((entry) => {
            const h = getHourNum(entry.hour);
            const isPeak = peakHours.includes(h);
            return (
              <Cell
                key={entry.hour}
                fill={isPeak ? '#ef4444' : '#374151'}
                fillOpacity={isPeak ? 0.8 : 0.6}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
