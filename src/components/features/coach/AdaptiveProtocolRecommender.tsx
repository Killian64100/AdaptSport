'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Warning, TrendUp, CheckCircle } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import {
  VFCLevel,
  AdaptiveProtocol,
  RecoveryState,
  recommendProtocols,
  calculateReadinessScore,
  getVFCRecommendations,
  VFC_THRESHOLDS,
} from '@/lib/adaptive-coach'

interface AdaptiveProtocolRecommenderProps {
  recoveryState: RecoveryState;
  availableProtocols: AdaptiveProtocol[];
  onProtocolSelect: (protocol: AdaptiveProtocol) => void;
}

const VFCColorMap: Record<VFCLevel, { bg: string; border: string; text: string; dot: string }> = {
  elite: {
    bg: 'bg-signal-success/10',
    border: 'border-signal-success/30',
    text: 'text-signal-success',
    dot: 'bg-signal-success',
  },
  good: {
    bg: 'bg-brand-electric/10',
    border: 'border-brand-electric/30',
    text: 'text-brand-electric',
    dot: 'bg-brand-electric',
  },
  adequate: {
    bg: 'bg-signal-caution/10',
    border: 'border-signal-caution/30',
    text: 'text-signal-caution',
    dot: 'bg-signal-caution',
  },
  compromised: {
    bg: 'bg-signal-critical/10',
    border: 'border-signal-critical/30',
    text: 'text-signal-critical',
    dot: 'bg-signal-critical',
  },
  critical: {
    bg: 'bg-signal-critical/20',
    border: 'border-signal-critical',
    text: 'text-signal-critical',
    dot: 'bg-signal-critical animate-pulse',
  },
};

export default function AdaptiveProtocolRecommender({
  recoveryState,
  availableProtocols,
  onProtocolSelect,
}: AdaptiveProtocolRecommenderProps) {
  const [expandedReason, setExpandedReason] = useState<string | null>(null);

  const recommendations = useMemo(() => {
    return recommendProtocols(recoveryState, availableProtocols, 3);
  }, [recoveryState, availableProtocols]);

  const readinessScore = useMemo(() => {
    return calculateReadinessScore(recoveryState);
  }, [recoveryState]);

  const vfcLabel = recoveryState.vfc.level.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* VFC Assessment Header */}
      <div className={`rounded-lg border p-6 ${VFCColorMap[recoveryState.vfc.level].bg} ${VFCColorMap[recoveryState.vfc.level].border}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full ${VFCColorMap[recoveryState.vfc.level].bg} border-2 ${VFCColorMap[recoveryState.vfc.level].border} flex items-center justify-center`}>
              <div className={`h-3 w-3 rounded-full ${VFCColorMap[recoveryState.vfc.level].dot}`} />
            </div>
            <div>
              <h3 className={`text-title-sm font-bold ${VFCColorMap[recoveryState.vfc.level].text}`}>VFC: {vfcLabel}</h3>
              <p className="text-body-xs text-text-secondary">
                {recoveryState.vfc.vfcValue}ms ({recoveryState.vfc.recoveryPercentage}% du baseline)
              </p>
            </div>
          </div>

          {/* Readiness Score */}
          <div className="text-right">
            <div className="text-title-lg font-bold text-brand-electric">
              {readinessScore}%
            </div>
            <p className="text-caption text-text-secondary">Readiness</p>
          </div>
        </div>

        {/* VFC Trend */}
        <div className="flex items-center gap-2 mb-4">
          <TrendUp size={16} className={recoveryState.vfc.trend === 'improving' ? 'text-signal-success' : recoveryState.vfc.trend === 'declining' ? 'text-signal-critical' : 'text-text-secondary'} />
          <span className="text-caption text-text-medium capitalize">
            {recoveryState.vfc.trend === 'improving' ? '↑ Improving' : recoveryState.vfc.trend === 'declining' ? '↓ Declining' : '→ Stable'}
          </span>
        </div>

        {/* VFC Recommendations */}
        <div className="space-y-2">
          <p className="text-caption font-semibold text-text-high">Recommendations:</p>
          {recoveryState.vfc.recommendations.slice(0, 2).map((rec, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-body-xs text-text-medium"
            >
              • {rec}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Critical Warning */}
      {recoveryState.vfc.level === 'critical' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-signal-critical/20 p-4 border-2 border-signal-critical flex gap-3"
        >
          <Warning size={24} weight="fill" className="text-signal-critical flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body-xs font-bold text-signal-critical mb-1">REST RECOMMENDED</p>
            <p className="text-caption text-text-medium">
              Your VFC is critically low. Avoid training and focus on recovery: sleep, nutrition, stress management.
            </p>
          </div>
        </motion.div>
      )}

      {/* Protocol Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain size={20} weight="fill" className="text-brand-electric" />
          <h3 className="text-title-sm font-bold text-text-high">AI-Powered Recommendations</h3>
        </div>

        <AnimatePresence mode="wait">
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={rec.protocol.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onProtocolSelect(rec.protocol)}
                    className={`rounded-lg border p-4 transition-all ${
                      rec.confidence > 75
                        ? 'border-signal-success/50 bg-signal-success/5 hover:bg-signal-success/10'
                        : rec.confidence > 50
                          ? 'border-brand-electric/30 bg-brand-electric/5 hover:bg-brand-electric/10'
                          : 'border-surface-card bg-surface-card hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-body-sm font-semibold text-text-high">
                          {rec.protocol.name}
                        </h4>
                        <p className="text-caption text-text-secondary mt-0.5">
                          {rec.protocol.category} • {rec.protocol.duration} min
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-right">
                          <div className="text-title-sm font-bold text-brand-electric">
                            {Math.round(rec.confidence)}%
                          </div>
                          <p className="text-caption text-text-secondary">Match</p>
                        </div>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: expandedReason === rec.protocol.id ? 'auto' : 0,
                        opacity: expandedReason === rec.protocol.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mt-3 pt-3 border-t border-surface-card space-y-2">
                        <p className="text-caption text-text-medium">{rec.reasoning}</p>

                        {/* Benefits */}
                        {rec.expectedBenefits.length > 0 && (
                          <div>
                            <p className="text-caption font-semibold text-signal-success mb-1">
                              ✓ Expected Benefits:
                            </p>
                            {rec.expectedBenefits.map((benefit, i) => (
                              <p key={i} className="text-caption text-text-medium ml-3">
                                • {benefit}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Risk Factors */}
                        {rec.riskFactors.length > 0 && (
                          <div>
                            <p className="text-caption font-semibold text-signal-caution mb-1">
                              ⚠️ Risk Factors:
                            </p>
                            {rec.riskFactors.map((risk, i) => (
                              <p key={i} className="text-caption text-text-medium ml-3">
                                • {risk}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Expand/Collapse Toggle */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedReason(
                          expandedReason === rec.protocol.id ? null : rec.protocol.id
                        );
                      }}
                      className="mt-2 text-caption text-brand-electric hover:text-brand-electric/80 transition-colors"
                    >
                      {expandedReason === rec.protocol.id ? 'Hide details' : 'Show details'}
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-surface-card p-6 text-center"
            >
              <p className="text-body-xs text-text-secondary">
                No safe protocols for current recovery state
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
