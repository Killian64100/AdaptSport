'use client';

import React from 'react';

interface ConfidencePillProps {
  level: 'high' | 'medium' | 'low';
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ConfidencePill - Capsule visuelle indiquant le niveau de certitude IA
 * Utilise des couleurs et des animations pour indiquer le niveau de confiance
 */
export function ConfidencePill({
  level,
  percentage,
  size = 'md',
}: ConfidencePillProps) {
  const sizeMap = {
    sm: 'px-3 py-1 text-caption',
    md: 'px-4 py-2 text-body-s',
    lg: 'px-5 py-3 text-body-m',
  };

  const colorMap = {
    high: {
      bg: 'bg-signal-success/20',
      border: 'border-signal-success/50',
      text: 'text-signal-success',
      dot: 'bg-signal-success',
    },
    medium: {
      bg: 'bg-signal-caution/20',
      border: 'border-signal-caution/50',
      text: 'text-signal-caution',
      dot: 'bg-signal-caution',
    },
    low: {
      bg: 'bg-signal-critical/20',
      border: 'border-signal-critical/50',
      text: 'text-signal-critical',
      dot: 'bg-signal-critical',
    },
  };

  const colors = colorMap[level];
  const containerClass = `inline-flex items-center gap-2 rounded-full border ${sizeMap[size]} ${colors.bg} ${colors.border}`;
  const dotClass = `w-2 h-2 rounded-full ${colors.dot} ${level === 'high' ? 'animate-pulse' : ''}`;
  const textClass = `font-medium ${colors.text}`;

  return (
    <div className={containerClass}>
      {/* Animated dot */}
      <div className={dotClass} />

      {/* Text */}
      <span className={textClass}>
        {percentage}%
      </span>

      {/* Label */}
      <span className="text-text-medium font-medium">
        {level === 'high' && 'High confidence'}
        {level === 'medium' && 'Moderate confidence'}
        {level === 'low' && 'Low confidence'}
      </span>
    </div>
  );
}
