'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import type { Biomarker } from './BiomarkerList'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'

// Convertit un nombre décimal (ex: 7.5) en chaîne horaire (ex: "7h30")
const decimalToTime = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours)
  const minutes = Math.round((decimalHours - hours) * 60)
  if (minutes === 60) return `${hours + 1}h00`
  return `${hours}h${minutes.toString().padStart(2, '0')}`
}

interface BiomarkerCardProps {
  biomarker: Biomarker
}

export default function BiomarkerCard({ biomarker }: BiomarkerCardProps) {
  const router = useRouter()
  const setSelectedMetric = useBiomarkerStore((state) => state.setSelectedMetric)
  const Icon = biomarker.icon

  // Format data for Recharts
  const chartData = biomarker.trend.map((value, index) => ({
    day: index,
    value,
  }))

  // Status colors
  const statusConfig = {
    normal: {
      bg: 'bg-surface-card',
      text: 'text-signal-success',
      line: '#00E676',
    },
    attention: {
      bg: 'bg-surface-card',
      text: 'text-signal-caution',
      line: '#FFC400',
    },
    alert: {
      bg: 'bg-surface-card',
      text: 'text-signal-critical',
      line: '#FF3D00',
    },
  }

  const config = statusConfig[biomarker.status]

  const handleClick = () => {
    // Définir la métrique sélectionnée dans le store
    setSelectedMetric(biomarker.id)
    router.push(`/health-data/biomarker/${biomarker.id}`)
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ opacity: 0.8 }}
      className={cn(
        'w-full rounded-xl p-4 text-left transition-colors hover:bg-surface-elevated',
        config.bg
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Icon + Name + Value */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={cn('rounded-lg bg-surface-elevated p-2', config.text)}>
            <Icon size={24} weight="bold" />
          </div>

          {/* Name + Value */}
          <div>
            <h3 className="text-body-m font-semibold text-text-highest">
              {biomarker.name}
            </h3>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="font-mono text-mono-l text-text-highest">
                {biomarker.id === 'sleep' ? decimalToTime(biomarker.value) : biomarker.value}
              </span>
              {biomarker.id !== 'sleep' && (
                <span className="text-caption text-text-medium">
                  {biomarker.unit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Sparkline */}
        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={config.line}
                strokeWidth={2}
                dot={false}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.button>
  )
}
