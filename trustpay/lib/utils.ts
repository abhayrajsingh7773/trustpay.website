import { clsx, type ClassValue } from 'clsx';
import type { RiskLevel } from './types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(timestamp: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

export function formatDateShort(timestamp: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'HIGH': return 'text-red-400';
    case 'MEDIUM': return 'text-amber-400';
    case 'LOW': return 'text-emerald-400';
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'HIGH': return 'bg-red-500/10 border-red-500/20 text-red-400';
    case 'MEDIUM': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    case 'LOW': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
  }
}

export function getRiskStrokeColor(level: RiskLevel): string {
  switch (level) {
    case 'HIGH': return '#ef4444';
    case 'MEDIUM': return '#f59e0b';
    case 'LOW': return '#22c55e';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 60) return '#ef4444';
  if (score >= 30) return '#f59e0b';
  return '#22c55e';
}
