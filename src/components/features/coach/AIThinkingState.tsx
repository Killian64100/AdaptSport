'use client'

import { motion } from 'framer-motion'
import { Brain } from '@phosphor-icons/react'

export default function AIThinkingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-start gap-3"
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-elevated">
        <Brain size={20} weight="fill" className="text-brand-electric" />
      </div>

      {/* Thinking Animation */}
      <div className="flex-1 rounded-2xl rounded-tl-sm bg-surface-card p-4">
        <div className="ai-thinking-mesh h-16 rounded-lg" />
        
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-3 text-body-s text-text-medium"
        >
          Analyzing your biomarkers...
        </motion.p>
      </div>
    </motion.div>
  )
}
