import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as percentage with custom decimals
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format time duration from minutes to readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Get HRV interpretation based on personal baseline
 * (Highly individual, requires user baseline)
 */
export function interpretHRV(
  value: number,
  baseline: number,
  range: { min: number; max: number }
): 'high' | 'normal' | 'low' {
  const percentage = (value / baseline) * 100;

  if (percentage >= 110) return 'high';
  if (percentage >= 90 && percentage < 110) return 'normal';
  return 'low';
}

/**
 * Determine readiness score based on multiple biomarkers
 */
export function calculateReadiness(metrics: {
  hrv: number;
  sleep: number;
  rhr: number;
  previous_hrv?: number;
}): { score: number; status: 'optimal' | 'good' | 'fair' | 'low' } {
  // Simple weighted formula (should be replaced with ML model)
  const hrvFactor = Math.min((metrics.hrv / 50) * 40, 40); // HRV weight: 40%
  const sleepFactor = Math.min((metrics.sleep / 8) * 40, 40); // Sleep weight: 40%
  const rhrFactor = Math.min((70 / metrics.rhr) * 20, 20); // RHR weight: 20%

  const score = Math.round(hrvFactor + sleepFactor + rhrFactor);

  let status: 'optimal' | 'good' | 'fair' | 'low';
  if (score >= 80) status = 'optimal';
  else if (score >= 60) status = 'good';
  else if (score >= 40) status = 'fair';
  else status = 'low';

  return { score, status };
}

/**
 * Calculate strain level based on training metrics
 */
export function calculateStrain(metrics: {
  intensity: number; // 0-100
  duration: number; // minutes
  hrVariability: number; // HRV during exercise
}): number {
  // Strain = (intensity * duration * hrVariability_inverse) / 100
  const strain = (metrics.intensity * (metrics.duration / 60) * (100 / metrics.hrVariability)) * 10;
  return Math.min(Math.round(strain), 100);
}

/**
 * Generate color based on biomarker status
 */
export function getStatusColor(
  value: number,
  optimalRange: { min: number; max: number }
): 'success' | 'caution' | 'critical' {
  if (value >= optimalRange.min && value <= optimalRange.max) {
    return 'success';
  }

  const distToMin = Math.abs(value - optimalRange.min);
  const distToMax = Math.abs(value - optimalRange.max);
  const distToRange = Math.min(distToMin, distToMax);

  // Critical if far from range (>20%)
  if (distToRange > (optimalRange.max - optimalRange.min) * 0.2) {
    return 'critical';
  }

  return 'caution';
}

/**
 * Debounce helper for event handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format date in a user-friendly way
 */
export function formatDate(date: Date, locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Privacy: Mask coordinates for sharing
 */
export function maskCoordinates(
  lat: number,
  lng: number,
  precision: number = 1 // km
): { lat: number; lng: number } {
  // Reduce precision by rounding
  const factor = Math.pow(10, 2); // ~1km at equator
  return {
    lat: Math.round(lat * factor) / factor,
    lng: Math.round(lng * factor) / factor,
  };
}

