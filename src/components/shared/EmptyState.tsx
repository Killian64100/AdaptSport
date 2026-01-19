'use client'

import { motion } from 'framer-motion'
import { Watch, Link as LinkIcon, AppleLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  type: 'biomarkers' | 'activities' | 'devices'
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

const emptyStateConfig = {
  biomarkers: {
    icon: Watch,
    title: 'Connect Your Data',
    description:
      'AdaptSport works best with history. Connect your wearable or import your existing data.',
    primaryLabel: 'Connect Apple Health',
    secondaryLabel: 'Enter Manually',
  },
  activities: {
    icon: LinkIcon,
    title: 'No Recorded Activities',
    description:
      'Start recording your workouts to see your trends and progress.',
    primaryLabel: 'Start an Activity',
    secondaryLabel: 'Import History',
  },
  devices: {
    icon: Watch,
    title: 'No Connected Device',
    description:
      'Connect your Oura Ring, Whoop, or Apple Watch for automatic tracking.',
    primaryLabel: 'Connect a Device',
    secondaryLabel: 'View Compatibility',
  },
}

export default function EmptyState({
  type,
  onPrimaryAction,
  onSecondaryAction,
}: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-surface-card p-8 text-center"
    >
      {/* Illustration */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 rounded-full bg-surface-elevated p-6"
      >
        <Icon size={64} weight="thin" className="text-brand-electric" />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-3 font-display text-display-s text-text-highest"
      >
        {config.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8 max-w-md text-body-m leading-relaxed text-text-medium"
      >
        {config.description}
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Button
          onClick={onPrimaryAction}
          className="flex items-center gap-2 bg-brand-electric text-surface-void hover:bg-brand-deep"
        >
          {type === 'biomarkers' && <AppleLogo size={20} weight="fill" />}
          {config.primaryLabel}
        </Button>

        <Button
          onClick={onSecondaryAction}
          variant="outline"
          className="border-surface-elevated bg-surface-elevated text-text-high hover:bg-surface-modal"
        >
          {config.secondaryLabel}
        </Button>
      </motion.div>

      {/* Help Link */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        href="#"
        className="mt-6 text-body-s text-brand-electric hover:underline"
      >
        Learn more about data connection
      </motion.a>
    </motion.div>
  )
}
