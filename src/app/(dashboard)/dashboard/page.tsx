'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useContextModeContext } from '@/components/providers/ContextModeProvider'
import BioGauge from '@/components/helix/organisms/BioGauge'
import QuickActions from '@/components/helix/layouts/QuickActions'
import DailyBriefing from '@/components/helix/organisms/DailyBriefing'
import ActiveModeView from '@/components/features/dashboard/ActiveModeView'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'

export default function PulsePage() {
  const { mode } = useContextModeContext()
  const { recovery } = useBiomarkerStore()
  
  // Calcul du readiness score basé sur recovery
  const readinessScore = Math.round(recovery)
  const status = recovery >= 75 ? 'optimal' : recovery >= 50 ? 'attention' : 'critical'
  
  const userData = {
    name: 'Alex',
    readinessScore,
    status: status as 'optimal' | 'attention' | 'critical',
  }

  // Mode Actif: Interface simplifiée
  if (mode === 'active') {
    return <ActiveModeView readinessScore={userData.readinessScore} />
  }

  // Modes Morning/Evening: Interface standard avec adaptations
  return (
    <div className="relative min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="animate-slide-up px-4 pb-6 pt-12"
      >
        <h1 className="mb-1 font-display text-3xl font-bold text-text-highest">
          {mode === 'morning' ? 'Good morning' : mode === 'evening' ? 'Good evening' : 'Good morning'}, {userData.name}
        </h1>
        <p className="text-text-medium">
          {mode === 'evening' ? 'Time to recover' : "You're ready to perform"}
        </p>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <BioGauge score={userData.readinessScore} status={userData.status} />
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'morning' && (
            <motion.div
              key="morning-briefing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-6 animate-slide-up"
            >
              <DailyBriefing />
            </motion.div>
          )}

          {mode === 'evening' && (
            <motion.div
              key="evening-recovery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-6 animate-slide-up rounded-xl bg-surface-card p-6"
            >
              <h3 className="mb-3 font-display text-lg font-semibold text-text-highest">
                Time to Recover
              </h3>
              <p className="leading-relaxed text-text-high">
                Your day has been intense. Prioritize relaxing activities
                to optimize your sleep.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <QuickActions />
    </div>
  )
}
