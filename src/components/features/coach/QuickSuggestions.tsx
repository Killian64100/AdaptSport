'use client'

import { motion } from 'framer-motion'

interface QuickSuggestionsProps {
  onSelect: (suggestion: string) => void
}

const suggestions = [
  'Adjust my workout',
  'Analyze my recovery',
  'Improve my sleep',
  'Explain my HRV',
]

export default function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex flex-wrap gap-2"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(suggestion)}
          className="rounded-full border border-surface-elevated bg-surface-card px-4 py-2 text-body-s text-text-high transition-colors hover:bg-surface-elevated"
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  )
}
