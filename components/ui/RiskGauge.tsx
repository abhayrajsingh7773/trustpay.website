'use client';

import { useEffect, useRef } from 'react';
import { getScoreColor } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;         // 0–100
  size?: number;         // SVG viewbox size
  label?: string;
  showScore?: boolean;
}

export default function RiskGauge({
  score,
  size = 200,
  label,
  showScore = true,
}: RiskGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.transition = 'none';
    circle.style.strokeDashoffset = `${circumference}`;
    // Trigger reflow
    void circle.getBoundingClientRect();
    circle.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
    circle.style.strokeDashoffset = `${strokeDashoffset}`;
  }, [score, circumference, strokeDashoffset]);

  const riskLabel =
    score >= 60 ? 'HIGH RISK' : score >= 30 ? 'MEDIUM RISK' : 'LOW RISK';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          className="rotate-[-90deg]"
        >
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#1f1f26"
            strokeWidth="12"
          />
          {/* Animated progress arc */}
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>

        {/* Center text */}
        {showScore && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-[2.75rem] font-bold leading-none tabular-nums"
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] mt-0.5">/ 100</span>
            <span
              className="text-[10px] font-bold tracking-widest mt-2"
              style={{ color }}
            >
              {riskLabel}
            </span>
          </div>
        )}
      </div>
      {label && (
        <p className="text-[12px] text-[var(--text-muted)] mt-2 text-center">{label}</p>
      )}
    </div>
  );
}
