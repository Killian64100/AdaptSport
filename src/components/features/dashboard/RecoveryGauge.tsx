'use client'

import { motion } from 'framer-motion'
import { Heartbeat, Lightning } from '@phosphor-icons/react'

interface RecoveryGaugeProps {
  percentage: number
}

export default function RecoveryGauge({ percentage }: RecoveryGaugeProps) {
  // Logique de couleur dynamique
  const getColor = () => {
    if (percentage < 50) return {
      primary: '#FF3D00',
      secondary: 'rgba(255, 61, 0, 0.2)',
      glow: 'rgba(255, 61, 0, 0.4)',
      label: 'Critique'
    }
    if (percentage < 80) return {
      primary: '#FFC400',
      secondary: 'rgba(255, 196, 0, 0.2)',
      glow: 'rgba(255, 196, 0, 0.4)',
      label: 'Modéré'
    }
    return {
      primary: '#00E676',
      secondary: 'rgba(0, 230, 118, 0.2)',
      glow: 'rgba(0, 230, 118, 0.5)',
      label: 'Optimal'
    }
  }

  const colors = getColor()
  const circumference = 2 * Math.PI * 80
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col items-center rounded-2xl bg-surface-card p-8"
    >
      {/* Title */}
      <div className="mb-6 flex items-center gap-2">
        <Heartbeat weight="duotone" size={24} className="text-brand-electric" />
        <h2 className="font-display text-lg font-semibold text-text-highest">
          Recovery
        </h2>
      </div>

      {/* Circular Gauge */}
      <div className="relative mb-6">
        {/* Glow Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundColor: colors.glow }}
        />

        <svg width="200" height="200" className="relative -rotate-90">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke={colors.secondary}
            strokeWidth="16"
            fill="none"
          />

          {/* Progress Circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            stroke={colors.primary}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              strokeDasharray: circumference,
              filter: `drop-shadow(0 0 8px ${colors.glow})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            className="text-center"
          >
            <div className="mb-1 font-display text-5xl font-bold text-text-highest">
              {percentage}
              <span className="text-3xl text-text-medium">%</span>
            </div>
            <div
              className="text-caption font-semibold uppercase tracking-wider"
              style={{ color: colors.primary }}
            >
              {colors.label}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 rounded-lg bg-surface-elevated px-4 py-2"
      >
        <Lightning
          weight="fill"
          size={16}
          style={{ color: colors.primary }}
        />
        <span className="text-sm text-text-high">
          {percentage >= 80 && "Prêt pour un entraînement intensif"}
          {percentage >= 50 && percentage < 80 && "Entraînement modéré recommandé"}
          {percentage < 50 && "Prioritize recovery today"}
        </span>
      </motion.div>
    </motion.div>
  )
}
