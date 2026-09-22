import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  className?: string;
  icon?: ReactNode;
}

export default function StatCard({
  label,
  value,
  sub,
  accent = false,
  className,
  icon,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'card p-4 flex flex-col gap-1 hover:border-[var(--border-light)] transition-colors',
        accent && 'border-red-500/20 bg-red-500/5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="label-section">{label}</span>
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
      </div>
      <span
        className={cn(
          'text-2xl font-bold mt-1',
          accent ? 'text-red-400' : 'text-white'
        )}
      >
        {value}
      </span>
      {sub && <span className="text-[11px] text-[var(--text-muted)]">{sub}</span>}
    </div>
  );
}
