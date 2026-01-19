'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ConfidencePillProps {
  confidence: number // 0-100
  className?: string
}

export default function ConfidencePill({ confidence, className }: ConfidencePillProps) {
  const getConfig = () => {
    if (confidence >= 90) {
      return {
        label: 'High certainty',
        color: 'bg-signal-success/20 text-signal-success',
        barColor: 'bg-signal-success',
      }
    } else if (confidence >= 70) {
      return {
        label: 'Moderate confidence',
        color: 'bg-signal-caution/20 text-signal-caution',
        barColor: 'bg-signal-caution',
      }
    } else {
      return {
        label: 'Insufficient data',
        color: 'bg-signal-critical/20 text-signal-critical',
        barColor: 'bg-signal-critical',
      }
    }
  }

  const config = getConfig()

  return (
    <div className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1', config.color, className)}>
      {/* Label */}
      <span className="text-caption font-medium">{confidence}%</span>
    </div>
  )
}
