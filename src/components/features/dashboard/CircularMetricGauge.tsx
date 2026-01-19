'use client'

import { motion } from 'framer-motion'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import { useRouter } from 'next/navigation'

interface CircularMetricGaugeProps {
  metricId: string
  value: number
  label: string
  unit: string
  color: string
  icon: React.ElementType
  size?: 'normal' | 'large'
}

export default function CircularMetricGauge({
  metricId,
  value,
  label,
  unit,
  color,
  icon: Icon,
  size = 'normal'
}: CircularMetricGaugeProps) {
  const router = useRouter()
  const { setSelectedMetric } = useBiomarkerStore()

  // Taille du cercle selon le prop
  const circleSize = size === 'large' ? 140 : 100
  const radius = size === 'large' ? 60 : 42
  const strokeWidth = size === 'large' ? 10 : 8
  const iconSize = size === 'large' ? 32 : 24
  const fontSize = size === 'large' ? 'text-4xl' : 'text-3xl'

  // Calcul pour le cercle de progression (percentage pour recovery, autre logique pour calories)
  const percentage = metricId === 'recovery' ? value : Math.min(100, (value / 3000) * 100)
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const handleClick = () => {
    setSelectedMetric(metricId)
    router.push(`/health-data/biomarker/${metricId}`)
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ opacity: 0.8 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center rounded-2xl bg-surface-card p-6"
      style={{
        border: `1px solid ${color}20`,
        boxShadow: `0 0 20px ${color}15, inset 0 0 10px ${color}05`
      }}
    >
      {/* Glow Effect Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-2xl blur-xl"
        style={{
          backgroundColor: color,
          opacity: 0.15,
          zIndex: 0
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative mb-4">
          <svg width={circleSize * 2} height={circleSize * 2} className="-rotate-90">
            {/* Background Circle */}
            <circle
              cx={circleSize}
              cy={circleSize}
              r={radius}
              stroke={`${color}30`}
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress Circle */}
            <motion.circle
              cx={circleSize}
              cy={circleSize}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              style={{
                strokeDasharray: circumference,
                filter: `drop-shadow(0 0 8px ${color})`
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon
              weight="duotone"
              size={iconSize}
              style={{ color, marginBottom: '8px' }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className={`font-display ${metricId === 'calories' ? 'text-2xl' : fontSize} font-bold text-text-highest`}>
                {metricId === 'calories' ? Math.round(value) : value}
                <span className="text-xs text-text-medium ml-1">{unit}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color }}
          >
            {label}
          </div>
        </motion.div>
      </div>
    </motion.button>
  )
}
