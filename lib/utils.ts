import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(value: number, max = 1): number {
  return Math.round((value / max) * 100);
}

export function scoreLabel(pct: number): string {
  if (pct >= 85) return 'Excellent';
  if (pct >= 70) return 'Good';
  if (pct >= 50) return 'Fair';
  if (pct >= 30) return 'Needs attention';
  return 'Priority concern';
}

export function scoreColor(pct: number): string {
  if (pct >= 85) return 'text-emerald-600';
  if (pct >= 70) return 'text-green-600';
  if (pct >= 50) return 'text-amber-600';
  if (pct >= 30) return 'text-orange-600';
  return 'text-red-600';
}

export function scoreBg(pct: number): string {
  if (pct >= 85) return 'bg-emerald-500';
  if (pct >= 70) return 'bg-green-500';
  if (pct >= 50) return 'bg-amber-500';
  if (pct >= 30) return 'bg-orange-500';
  return 'bg-red-500';
}
