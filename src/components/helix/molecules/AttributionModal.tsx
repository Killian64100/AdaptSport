'use client'

import { motion } from 'framer-motion'
import { X, TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface AttributionData {
  factors: Array<{
    label: string
    impact: number
    direction: 'positive' | 'negative' | 'neutral'
  }>
}

interface AttributionModalProps {
  attribution: AttributionData
  onClose: () => void
}

export default function AttributionModal({ attribution, onClose }: AttributionModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-surface-elevated border-surface-elevated">
        <DialogTitle className="sr-only">Attribution Details</DialogTitle>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="font-display text-body-l font-semibold text-text-highest">
              Pourquoi cette recommandation ?
            </h3>
            <p className="mt-1 text-body-s text-text-medium">
              Facteurs physiologiques analysés
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-medium transition-colors hover:bg-surface-modal hover:text-text-high"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Factors List */}
        <div className="space-y-4">
          {attribution.factors.map((factor, index) => {
            const Icon =
              factor.direction === 'positive'
                ? TrendUp
                : factor.direction === 'negative'
                ? TrendDown
                : Minus

            const color =
              factor.direction === 'positive'
                ? 'text-signal-success'
                : factor.direction === 'negative'
                ? 'text-signal-critical'
                : 'text-text-medium'

            return (
              <motion.div
                key={factor.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                {/* Factor Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} weight="bold" className={color} />
                    <span className="text-body-m text-text-high">{factor.label}</span>
                  </div>
                  <span className="font-mono text-mono-m text-text-highest">
                    {factor.impact > 0 ? '+' : ''}{factor.impact}%
                  </span>
                </div>

                {/* Impact Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-card">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(factor.impact)}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className={`h-full ${
                      factor.direction === 'positive'
                        ? 'bg-signal-success'
                        : factor.direction === 'negative'
                        ? 'bg-signal-critical'
                        : 'bg-text-medium'
                    }`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-lg bg-surface-card p-4"
        >
          <p className="text-body-s leading-relaxed text-text-high">
            Cette recommandation est basée sur l'analyse combinée de vos biomarqueurs.
            Les facteurs négatifs indiquent une charge physiologique élevée.
          </p>
        </motion.div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-brand-electric py-3 font-medium text-surface-void transition-colors hover:bg-brand-deep"
        >
          Compris
        </button>
      </DialogContent>
    </Dialog>
  )
}
