'use client';

import React from 'react';

interface BioGaugeProps {
  stressLevel: number; // 0-100
  recoveryLevel: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

/**
 * BioGauge - Hero component central
 * Visualise l'équilibre Stress/Récupération en forme circulaire
 * Utilise une animation de gradient pour l'esthétique "Bioluminescence"
 */
export function BioGauge({
  stressLevel,
  recoveryLevel,
  size = 'lg',
  animated = true,
}: BioGaugeProps) {
  const sizeMap = {
    sm: { radius: 40, strokeWidth: 4 },
    md: { radius: 60, strokeWidth: 5 },
    lg: { radius: 80, strokeWidth: 6 },
  };

  const config = sizeMap[size];
  const circumference = 2 * Math.PI * config.radius;

  // Stress: rouge-orangé (signal-critical)
  // Recovery: vert néon (signal-success)
  const stressOffset = circumference - (stressLevel / 100) * (circumference / 2);
  const recoveryOffset = circumference - (recoveryLevel / 100) * (circumference / 2);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className={`relative ${animated ? 'animate-gradient' : ''}`}>
        <svg
          width={config.radius * 2 + 20}
          height={config.radius * 2 + 20}
          viewBox={`0 0 ${config.radius * 2 + 20} ${config.radius * 2 + 20}`}
          className="drop-shadow-lg"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-surface-card"
          />

          {/* Recovery (top half - green) */}
          <circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            fill="none"
            stroke="url(#gradientRecovery)"
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference / 2}
            strokeDashoffset={recoveryOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${config.radius + 10} ${config.radius + 10})`}
            className="transition-all duration-1000"
          />

          {/* Stress (bottom half - red) */}
          <circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            fill="none"
            stroke="url(#gradientStress)"
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference / 2}
            strokeDashoffset={stressOffset}
            strokeLinecap="round"
            transform={`rotate(90 ${config.radius + 10} ${config.radius + 10})`}
            className="transition-all duration-1000"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="gradientRecovery" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#69F0AE" />
              <stop offset="100%" stopColor="#00E676" />
            </linearGradient>
            <linearGradient id="gradientStress" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6E40" />
              <stop offset="100%" stopColor="#FF3D00" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-display-s font-display font-bold text-text-highest">
              {Math.round((recoveryLevel + (100 - stressLevel)) / 2)}%
            </div>
            <div className="text-caption text-text-medium">Readiness</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-signal-success" />
          <span className="text-text-medium">Recovery: {recoveryLevel}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-signal-critical" />
          <span className="text-text-medium">Stress: {stressLevel}%</span>
        </div>
      </div>
    </div>
  );
}
