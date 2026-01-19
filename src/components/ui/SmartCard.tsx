'use client';

import React from 'react';
import type { AIInsight } from '@/lib/types';

interface SmartCardProps {
  insight: AIInsight;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

/**
 * SmartCard - Organisme complexe capable de s'étendre
 * Affiche un insight IA avec un mécanisme "Pourquoi?" pour l'attribution
 */
export function SmartCard({
  insight,
  expanded: initialExpanded = false,
  onExpandChange,
}: SmartCardProps) {
  const [expanded, setExpanded] = React.useState(initialExpanded);

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  const getConfidenceColor = () => {
    const level = insight.confidence.level;
    switch (level) {
      case 'high':
        return 'bg-signal-success/20 border-signal-success/50';
      case 'medium':
        return 'bg-signal-caution/20 border-signal-caution/50';
      case 'low':
        return 'bg-signal-critical/20 border-signal-critical/50';
    }
  };

  const getCategoryIcon = () => {
    const icons: Record<string, string> = {
      recovery: '💪',
      training: '⚡',
      sleep: '😴',
      stress: '🧠',
      nutrition: '🥗',
    };
    return icons[insight.category] || '📊';
  };

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all duration-300
        ${getConfidenceColor()}
        ${expanded ? 'ring-1 ring-brand-electric/50' : ''}
        hover:bg-surface-elevated/50 cursor-pointer
      `}
      onClick={handleToggle}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{getCategoryIcon()}</span>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-text-highest text-body-l">
              {insight.title}
            </h3>
            <p className="text-text-medium text-body-s mt-1">
              {insight.description}
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {insight.confidence.level === 'high' && (
              <div className="w-2 h-2 rounded-full bg-signal-success animate-pulse" />
            )}
            {insight.confidence.level === 'medium' && (
              <div className="w-2 h-2 rounded-full bg-signal-caution animate-pulse" />
            )}
            {insight.confidence.level === 'low' && (
              <div className="w-2 h-2 rounded-full bg-signal-critical" />
            )}
            <span className="text-caption text-text-medium">
              {insight.confidence.percentage}%
            </span>
          </div>
          <span className="text-overline text-text-low uppercase">
            {insight.confidence.level}
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="animate-slide-up mt-4 pt-4 border-t border-surface-card space-y-3">
          {/* Factors */}
          <div>
            <h4 className="text-caption font-semibold text-text-medium uppercase mb-2">
              Pourquoi ?
            </h4>
            <div className="space-y-2">
              {insight.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between text-body-s">
                  <span className="text-text-medium">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono ${
                        factor.impact > 0 ? 'text-signal-success' : 'text-signal-critical'
                      }`}
                    >
                      {factor.impact > 0 ? '+' : ''}{factor.impact}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-caption text-text-low mt-2">
              {insight.factors[0]?.explanation}
            </p>
          </div>

          {/* Actionable */}
          <div className="bg-surface-card/50 rounded p-3">
            <p className="text-body-s text-text-high">
              <span className="font-semibold text-brand-electric">Action:</span>{' '}
              {insight.actionable}
            </p>
          </div>
        </div>
      )}

      {/* Toggle indicator */}
      <div className="flex justify-end mt-2">
        <span
          className={`text-text-low transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
