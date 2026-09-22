'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Smartphone,
  MapPin,
  MessageSquare,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import type { RiskReason, RiskLevel } from '@/lib/types';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  amount_extreme: TrendingUp,
  amount_elevated: TrendingUp,
  amount_above_range: TrendingUp,
  new_recipient: User,
  new_device: Smartphone,
  location_anomaly: MapPin,
  message_signal: MessageSquare,
  frequency_anomaly: Zap,
};

interface RiskSignalCardProps {
  reason: RiskReason;
  index?: number;
}

const SEVERITY_STYLES: Record<RiskLevel, { border: string; badge: string; dot: string }> = {
  HIGH: {
    border: 'border-red-500/20 bg-red-500/5',
    badge: 'bg-red-500/15 text-red-400 border border-red-500/25',
    dot: 'bg-red-400',
  },
  MEDIUM: {
    border: 'border-amber-500/20 bg-amber-500/5',
    badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    dot: 'bg-amber-400',
  },
  LOW: {
    border: 'border-emerald-500/20 bg-emerald-500/5',
    badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
};

export default function RiskSignalCard({ reason, index = 0 }: RiskSignalCardProps) {
  const [visible, setVisible] = useState(false);
  const styles = SEVERITY_STYLES[reason.severity];
  const Icon = ICON_MAP[reason.type] || AlertTriangle;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={cn(
        'border rounded-md p-4 transition-all duration-500',
        styles.border,
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded flex items-center justify-center mt-0.5',
            reason.severity === 'HIGH'
              ? 'bg-red-500/15'
              : reason.severity === 'MEDIUM'
              ? 'bg-amber-500/15'
              : 'bg-emerald-500/15'
          )}
        >
          <Icon
            size={15}
            className={
              reason.severity === 'HIGH'
                ? 'text-red-400'
                : reason.severity === 'MEDIUM'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase', styles.badge)}>
              {reason.severity}
            </span>
            <span className="text-[13px] font-semibold text-white leading-tight">
              {reason.title}
            </span>
          </div>

          <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed">
            {reason.description}
          </p>

          {reason.technicalDetail && (
            <p className="font-mono text-[10.5px] text-[var(--text-muted)]/60 mt-1.5 bg-[var(--surface-2)] px-2 py-1 rounded border border-[var(--border)]">
              {reason.technicalDetail}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 text-right">
          <div className={cn('w-2 h-2 rounded-full mt-1', styles.dot)} />
        </div>
      </div>
    </div>
  );
}
