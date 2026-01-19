'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Warning, Info } from '@phosphor-icons/react'
import { useEffect } from 'react'

type FeedbackType = 'success' | 'error' | 'warning' | 'info'

interface FeedbackToastProps {
  type: FeedbackType
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const feedbackConfig = {
  success: {
    icon: CheckCircle,
    color: 'bg-signal-success/20 border-signal-success text-signal-success',
    flash: 'bg-signal-success',
  },
  error: {
    icon: XCircle,
    color: 'bg-signal-critical/20 border-signal-critical text-signal-critical',
    flash: 'bg-signal-critical',
  },
  warning: {
    icon: Warning,
    color: 'bg-signal-caution/20 border-signal-caution text-signal-caution',
    flash: 'bg-signal-caution',
  },
  info: {
    icon: Info,
    color: 'bg-brand-electric/20 border-brand-electric text-brand-electric',
    flash: 'bg-brand-electric',
  },
}

export default function FeedbackToast({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000,
}: FeedbackToastProps) {
  const config = feedbackConfig[type]
  const Icon = config.icon
  const containerFlashClass = `fixed inset-0 z-50 pointer-events-none ${config.flash}`
  const toastClass = `flex items-center gap-3 rounded-xl border px-6 py-4 shadow-glow-md backdrop-blur-md ${config.color}`

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Flash Effect (simulates haptic feedback visually) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={containerFlashClass}
          />

          {/* Toast */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
            style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <div className={toastClass}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Icon size={24} weight="fill" />
              </motion.div>
              <span className="font-medium text-body-m text-text-highest">
                {message}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
