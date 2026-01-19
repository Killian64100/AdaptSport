'use client'

import { motion } from 'framer-motion'
import { Heart, Pulse, Moon, Wind, Fire } from '@phosphor-icons/react'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import { useRouter } from 'next/navigation'

interface MetricBand {
  id: string
  name: string
  value: number
  unit: string
  icon: React.ElementType
  color: string
}

export default function MetricBands() {
  const { hrv, rhr, sleep, spo2, strain, setSelectedMetric } = useBiomarkerStore()
  const router = useRouter()

  const metrics: MetricBand[] = [
    {
      id: 'hrv',
      name: 'VFC',
      value: hrv,
      unit: 'ms',
      icon: Heart,
      color: '#00E5FF'
    },
    {
      id: 'rhr',
      name: 'FC Repos',
      value: rhr,
      unit: 'bpm',
      icon: Pulse,
      color: '#FF6E40'
    },
    {
      id: 'sleep',
      name: 'Sommeil',
      value: sleep,
      unit: 'h',
      icon: Moon,
      color: '#7C4DFF'
    },
    {
      id: 'spo2',
      name: 'SpO₂',
      value: spo2,
      unit: '%',
      icon: Wind,
      color: '#00E676'
    },
    {
      id: 'strain',
      name: 'Strain',
      value: strain,
      unit: '/21',
      icon: Fire,
      color: '#FFC400'
    }
  ]

  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(metricId)
    router.push(`/health-data/biomarker/${metricId}`)
  }

  return (
    <div className="space-y-3">
      {metrics.map((metric, index) => (
        <motion.button
          key={metric.id}
          onClick={() => handleMetricClick(metric.id)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ opacity: 0.8 }}
          transition={{
            duration: 0.4,
            delay: index * 0.06,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="w-full flex items-center justify-between rounded-xl bg-surface-card p-4 text-left"
          style={{
            border: `1px solid ${metric.color}15`,
            boxShadow: `0 0 15px ${metric.color}08`
          }}
        >
          {/* Left: Icon + Name */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${metric.color}20`,
                boxShadow: `0 0 10px ${metric.color}25`
              }}
            >
              <metric.icon
                weight="duotone"
                size={20}
                style={{ color: metric.color }}
              />
            </div>
            <span className="font-medium text-text-high">{metric.name}</span>
          </div>

          {/* Right: Value */}
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-text-highest">
              {metric.id === 'sleep' ? metric.value.toFixed(1) : Math.round(metric.value)}
            </span>
            <span className="text-sm text-text-medium">{metric.unit}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
