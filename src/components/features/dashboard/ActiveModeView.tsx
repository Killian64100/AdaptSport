'use client'

import { motion } from 'framer-motion'
import { Pause, Play } from '@phosphor-icons/react'

interface ActiveModeViewProps {
  readinessScore: number
}

export default function ActiveModeView({ readinessScore }: ActiveModeViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-void px-8">
      {/* Simplified Large Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Score */}
        <div className="mb-12">
          <p className="mb-4 text-body-l text-text-medium">Recovery</p>
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-display text-[8rem] leading-none text-signal-success"
          >
            {readinessScore}%
          </motion.div>
        </div>

        {/* Massive Action Buttons */}
        <div className="flex gap-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-signal-critical shadow-glow-critical"
          >
            <Pause size={48} weight="fill" className="text-surface-void" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-signal-success shadow-glow-success"
          >
            <Play size={48} weight="fill" className="ml-2 text-surface-void" />
          </motion.button>
        </div>

        {/* Status Text */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12 text-display-s text-text-high"
        >
          Active Mode
        </motion.p>
      </motion.div>
    </div>
  )
}
