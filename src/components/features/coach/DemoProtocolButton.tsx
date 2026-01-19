'use client'

import { motion } from 'framer-motion'
import { Sparkle } from '@phosphor-icons/react'

interface DemoProtocolButtonProps {
  onAddDemoMessage: (protocolId: string) => void
}

const demoProtocols = [
  { id: 'wim-hof', label: '🌬️ Respiration', description: 'Recommander Wim Hof' },
  { id: 'cold-exposure', label: '❄️ Froid', description: 'Recommander douche froide' },
  { id: 'sleep-hygiene', label: '🌙 Sommeil', description: 'Recommander routine sommeil' },
  { id: 'fasting', label: '🍽️ Nutrition', description: 'Recommander jeûne 16:8' },
]

export default function DemoProtocolButton({ onAddDemoMessage }: DemoProtocolButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-lg border border-brand-electric/20 bg-brand-electric/5 p-4"
    >
      <div className="mb-2 flex items-center gap-2 text-caption font-semibold text-brand-electric">
        <Sparkle size={16} weight="fill" />
        Demo Mode: Test recommendations
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {demoProtocols.map(protocol => (
          <button
            key={protocol.id}
            onClick={() => onAddDemoMessage(protocol.id)}
            className="rounded-md bg-surface-card px-3 py-2 text-left text-caption text-text-high transition-colors hover:bg-surface-elevated"
          >
            <div className="font-medium">{protocol.label}</div>
            <div className="text-text-low">{protocol.description}</div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
