'use client';

import React from 'react';

interface MetricChipProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  unit?: string;
  status?: 'normal' | 'caution' | 'critical';
  onClick?: () => void;
}

/**
 * MetricChip - Atome pour afficher une métrique bio
 * Composé d'une icône, d'une valeur et d'un label
 * Utilisé dans les listes de biomarqueurs
 */
export function MetricChip({
  icon,
  value,
  label,
  unit,
  status = 'normal',
  onClick,
}: MetricChipProps) {
  const statusColors = {
    normal: 'bg-surface-card border-surface-elevated hover:border-brand-electric',
    caution: 'bg-signal-caution/10 border-signal-caution/50 hover:border-signal-caution',
    critical: 'bg-signal-critical/10 border-signal-critical/50 hover:border-signal-critical',
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border transition-all
        ${statusColors[status]}
        ${onClick ? 'cursor-pointer active:brightness-110' : 'cursor-default'}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-xl">{icon}</div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-baseline gap-1">
          <span className="font-display font-semibold text-text-highest text-mono-l">
            {value}
          </span>
          {unit && <span className="text-caption text-text-medium">{unit}</span>}
        </div>
        <p className="text-caption text-text-medium">{label}</p>
      </div>

      {/* Status indicator */}
      {status !== 'normal' && (
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            status === 'caution' ? 'bg-signal-caution animate-pulse' : 'bg-signal-critical'
          }`}
        />
      )}
    </button>
  );
}
