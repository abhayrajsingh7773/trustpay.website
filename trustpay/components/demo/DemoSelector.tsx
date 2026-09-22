'use client';

import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/lib/mock-data';
import type { DemoScenario } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DemoSelectorProps {
  onSelect?: (scenario: DemoScenario) => void;
  compact?: boolean;
}

const RISK_COLORS: Record<string, string> = {
  LOW: 'border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/50',
  MEDIUM: 'border-amber-500/25 bg-amber-500/5 hover:border-amber-500/50',
  HIGH: 'border-red-500/25 bg-red-500/5 hover:border-red-500/50',
};

const RISK_TEXT: Record<string, string> = {
  LOW: 'text-emerald-400',
  MEDIUM: 'text-amber-400',
  HIGH: 'text-red-400',
};

export default function DemoSelector({ onSelect, compact = false }: DemoSelectorProps) {
  const router = useRouter();

  const handleSelect = (scenarioId: DemoScenario) => {
    if (onSelect) {
      onSelect(scenarioId);
    } else if (scenarioId === 'coordinated') {
      router.push('/network');
    }
  };

  return (
    <div className="border border-[var(--border-light)] rounded-md p-4 bg-[var(--surface-2)]">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={13} className="text-amber-400" />
        <span className="label-section">Demo Scenarios</span>
      </div>
      <div className={cn('grid gap-2', compact ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3')}>
        {DEMO_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleSelect(scenario.id)}
            className={cn(
              'border rounded p-3 text-left transition-all duration-150 cursor-pointer',
              RISK_COLORS[scenario.expectedRisk]
            )}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-white">{scenario.label}</span>
              <span className={cn('text-[10px] font-bold', RISK_TEXT[scenario.expectedRisk])}>
                {scenario.expectedScore}
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-snug">
              {scenario.description}
            </p>
            {!compact && (
              <p className="font-mono text-[9px] text-[var(--text-muted)]/60 mt-1.5">
                ₹{scenario.amount.toLocaleString('en-IN')} → {scenario.recipient}
              </p>
            )}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-[var(--text-muted)] mt-2.5">
        Click a scenario to pre-fill the payment form with demo data.
      </p>
    </div>
  );
}
