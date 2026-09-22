'use client';

import { useEffect, useState } from 'react';
import { getSystemStatus } from '@/lib/api';
import type { SystemStatus } from '@/lib/types';

export default function SystemStatusWidget() {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    getSystemStatus().then(setStatus);
  }, []);

  if (!status) return null;

  const allGood =
    status.riskEngine === 'operational' &&
    status.behaviorModel === 'operational' &&
    status.database === 'connected';

  return (
    <div className="px-2 py-2 rounded bg-[var(--surface-2)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="label-section text-[10px]">System Status</span>
        <span
          className={`text-[10px] font-medium ${allGood ? 'text-emerald-400' : 'text-amber-400'}`}
        >
          {allGood ? 'All Systems Go' : 'Degraded'}
        </span>
      </div>
      <div className="space-y-1">
        {[
          { label: 'Risk Engine', value: status.riskEngine },
          { label: 'Behavior Model', value: status.behaviorModel },
          { label: 'Database', value: status.database },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-muted)]">{item.label}</span>
            <div className="flex items-center gap-1.5">
              <span className={`status-dot ${item.value}`} />
              <span className="text-[10px] text-[var(--text-muted)] capitalize">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-muted)]">Model</span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">{status.modelVersion}</span>
      </div>
    </div>
  );
}
