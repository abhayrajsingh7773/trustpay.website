import { cn, getRiskBgColor } from '@/lib/utils';
import type { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ level, className, size = 'md' }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'risk-badge',
        level === 'HIGH' && 'risk-badge-high',
        level === 'MEDIUM' && 'risk-badge-medium',
        level === 'LOW' && 'risk-badge-low',
        size === 'sm' && 'text-[10px] py-[2px] px-[6px]',
        className
      )}
    >
      {level}
    </span>
  );
}
