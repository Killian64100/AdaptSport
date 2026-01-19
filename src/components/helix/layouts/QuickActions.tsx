'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Wind, House, ChatCircle } from '@phosphor-icons/react'
import { useContextMode } from '@/hooks/useContextMode'
import { useGeofence } from '@/hooks/useGeofence'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'

interface QuickAction {
  id: string
  icon: React.ElementType
  label: string
  action: () => void
  color?: string
}

export default function QuickActions() {
  const { mode } = useContextMode()
  const { currentZone } = useGeofence()
  const [isPressed, setIsPressed] = useState<string | null>(null)
  const router = useRouter()
  const { recovery, strain, hrv, rhr, sleep, spo2, calories } = useBiomarkerStore()

  // Actions selon contexte
  const getActions = (): QuickAction[] => {
    // Evening mode: priorité récupération
    if (mode === 'evening') {
      return [
        {
          id: 'meditation',
          icon: Wind,
          label: 'Méditation',
          action: () => handleAction('meditation'),
        },
      ]
    }

    // Geofence home: action repos
    if (currentZone === 'home') {
      return [
        {
          id: 'home',
          icon: House,
          label: 'Mode Repos',
          action: () => handleAction('home'),
        },
      ]
    }

    // Default: Demander au Coach
    return [
      {
        id: 'coach',
        icon: ChatCircle,
        label: 'Ask the Coach',
        action: () => handleAction('coach'),
      },
    ]
  }

  const handleAction = (actionId: string) => {
    setIsPressed(actionId)

    // Navigation vers le Coach avec contexte
    if (actionId === 'coach') {
      // Stocker le contexte actuel dans localStorage pour initialisation du Coach
      const currentContext = {
        recovery,
        strain,
        hrv,
        rhr,
        sleep,
        spo2,
        calories,
        timestamp: Date.now(),
      }
      localStorage.setItem('coach_context', JSON.stringify(currentContext))
      router.push('/coach')
    } else {
      // Simulate haptic feedback
      console.log(`Action triggered: ${actionId}`)
    }

    // Reset pressed state
    setTimeout(() => setIsPressed(null), 200)
  }

  const actions = getActions()

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3">
      <AnimatePresence mode="wait">
        {actions.map((action, index) => {
          const Icon = action.icon

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              whileTap={{ scale: 0.92 }}
              onClick={action.action}
              className={`group relative flex h-14 items-center gap-3 overflow-hidden rounded-full px-5 shadow-glow-md transition-all hover:shadow-glow-lg active:shadow-glow-sm ${
                mode === 'evening'
                  ? 'bg-signal-caution'
                  : 'bg-brand-electric'
              }`}
              style={{ minWidth: '56px' }}
            >
              {/* Pressed Effect */}
              {isPressed === action.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-full bg-white"
                />
              )}

              <Icon
                size={24}
                weight="fill"
                className="relative z-10 text-surface-void transition-transform group-hover:scale-110"
              />
              <span className="relative z-10 text-body-m font-semibold text-surface-void">
                {action.label}
              </span>
            </motion.button>
          )
        })}
      </AnimatePresence>

      {/* Debug Zone Indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && currentZone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-surface-card px-3 py-2 text-caption text-text-medium"
        >
          Zone: {currentZone}
        </motion.div>
      )}
    </div>
  )
}
