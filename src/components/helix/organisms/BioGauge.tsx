'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface BioGaugeProps {
  score: number // 0-100
  status: 'optimal' | 'attention' | 'critical'
  className?: string
}

interface Contributor {
  label: string
  value: number
  impact: 'positive' | 'negative' | 'neutral'
}

// Données simulées des contributeurs
const mockContributors: Contributor[] = [
  { label: 'Sleep', value: 92, impact: 'positive' },
  { label: 'VFC', value: 78, impact: 'positive' },
  { label: 'Training load', value: 45, impact: 'negative' },
]

export default function BioGauge({ score, status, className }: BioGaugeProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Mapping status → colors
  const statusConfig = {
    optimal: {
      gradient: 'from-signal-success to-brand-electric',
      glow: 'shadow-glow-success',
      textColor: 'text-signal-success',
    },
    attention: {
      gradient: 'from-signal-caution to-data-strain',
      glow: 'shadow-[0_0_16px_rgba(255,196,0,0.4)]',
      textColor: 'text-signal-caution',
    },
    critical: {
      gradient: 'from-signal-critical to-data-strain',
      glow: 'shadow-glow-critical',
      textColor: 'text-signal-critical',
    },
  }

  const config = statusConfig[status]
  const circumference = 2 * Math.PI * 140 // rayon 140px
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={cn('relative', className)}>
      {/* Main Gauge */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className="relative mx-auto block w-full max-w-[320px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric focus-visible:ring-offset-2 focus-visible:ring-offset-surface-void"
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Card */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-card p-8">
          {/* SVG Circle */}
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 320 320"
          >
            {/* Background Circle (Track) */}
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-surface-elevated opacity-30"
            />

            {/* Animated Progress Circle */}
            <motion.circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.3,
              }}
              stroke="url(#bioGradient)"
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="bioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={
                    status === 'optimal'
                      ? '#00E676'
                      : status === 'attention'
                      ? '#FFC400'
                      : '#FF3D00'
                  }
                />
                <stop offset="100%" stopColor="#2F80ED" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="relative flex h-full flex-col items-center justify-center">
            {/* Score Number with Label */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              {/* Label "Récupération" */}
              <div className="mb-2 text-xs font-light tracking-wider text-text-low">
                RECOVERY
              </div>
              
              {/* Score */}
              <div>
                <span className="font-display text-display-l leading-none text-text-highest">
                  {score}
                </span>
                <span className="font-display text-display-s text-text-medium">
                  %
                </span>
              </div>
            </motion.div>

            {/* Status Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-3 flex items-center gap-2"
            >
              <span className={cn('text-body-s font-semibold', config.textColor)}>
                {status === 'optimal'
                  ? 'Ready to perform'
                  : status === 'attention'
                  ? 'Moderation required'
                  : 'Recovery needed'}
              </span>
            </motion.div>

            {/* Baseline Range Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-4 text-caption text-text-low"
            >
              Your normal range: 70-90
            </motion.div>
          </div>

          {/* Tap Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <span className="text-caption text-text-low">
              Tap for details
            </span>
          </motion.div>
        </div>
      </motion.button>

      {/* Progressive Disclosure - Contributors */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-xl bg-surface-card p-6">
              <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
                Main Contributors
              </h3>

              <div className="space-y-3">
                {mockContributors.map((contributor, index) => (
                  <motion.div
                    key={contributor.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    {/* Label & Icon */}
                    <div className="flex items-center gap-2">
                      {contributor.impact === 'positive' ? (
                        <TrendUp
                          size={16}
                          weight="bold"
                          className="text-signal-success"
                        />
                      ) : contributor.impact === 'negative' ? (
                        <TrendDown
                          size={16}
                          weight="bold"
                          className="text-signal-critical"
                        />
                      ) : (
                        <Minus
                          size={16}
                          weight="bold"
                          className="text-text-medium"
                        />
                      )}
                      <span className="text-body-m text-text-high">
                        {contributor.label}
                      </span>
                    </div>

                    {/* Value */}
                    <span className="font-mono text-mono-m text-text-highest">
                      {contributor.value}%
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetails(false)}
                className="mt-6 w-full rounded-lg bg-surface-elevated py-3 text-body-m font-medium text-text-high transition-colors hover:bg-surface-modal"
              >
                Close Details
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
