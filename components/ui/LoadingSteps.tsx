'use client';

import { useState } from 'react';

interface LoadingStep {
  label: string;
  done: boolean;
  active: boolean;
}

interface LoadingStepsProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export default function LoadingSteps({ steps, currentStep }: LoadingStepsProps) {
  return (
    <div className="space-y-3 py-2">
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex items-center gap-3">
            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
              {done ? (
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                  <circle cx="8" cy="8" r="7" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5" />
                  <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : active ? (
                <div className="flex gap-0.5">
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border border-[var(--border-light)]" />
              )}
            </div>
            <span
              className={`text-[13px] transition-colors ${
                done
                  ? 'text-[var(--text-muted)] line-through decoration-[var(--text-muted)]'
                  : active
                  ? 'text-white font-medium'
                  : 'text-[var(--text-muted)]/50'
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
