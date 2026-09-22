'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  color = '#ef4444',
  height = 4,
  animated = true,
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div
      className="progress-track w-full"
      style={{ height }}
    >
      <div
        className="progress-fill"
        style={{
          width: animated ? `${width}%` : `${value}%`,
          background: color,
          height,
        }}
      />
    </div>
  );
}
