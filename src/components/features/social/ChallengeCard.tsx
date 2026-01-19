'use client'

import { motion } from 'framer-motion'
import { Pulse, Timer, Users } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { generateGeometricAvatar } from '@/lib/avatarGenerator'

interface ChallengeCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  participants: number
  daysLeft: number
  isJoined?: boolean
  onJoin?: () => void
  onLeave?: () => void
  onLeaderboard?: () => void
}

export default function ChallengeCard({
  id,
  title,
  description,
  icon,
  participants,
  daysLeft,
  isJoined = false,
  onJoin,
  onLeave,
  onLeaderboard,
}: ChallengeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-lg bg-surface-card p-4 border border-surface-border hover:border-brand-electric/30 transition-colors"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-electric/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header with icon */}
        <div className="mb-3 flex items-start justify-between">
          <div className="text-3xl text-brand-electric">
            {icon}
          </div>
          {isJoined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-signal-success/20 px-2 py-1"
            >
              <span className="text-caption font-semibold text-signal-success">
                Rejoint
              </span>
            </motion.div>
          )}
        </div>

        {/* Title and description */}
        <h3 className="font-bold text-title-sm text-text-high mb-2">{title}</h3>
        <p className="text-caption text-text-medium mb-4">{description}</p>

        {/* Metrics */}
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg bg-surface-elevated/50 px-2 py-2"
          >
            <Users size={16} className="mx-auto mb-1 text-brand-electric" weight="bold" />
            <div className="text-body-xs font-semibold text-text-high">{participants}</div>
            <div className="text-caption text-text-secondary">athlètes</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg bg-surface-elevated/50 px-2 py-2"
          >
            <Timer size={16} className="mx-auto mb-1 text-signal-caution" weight="bold" />
            <div className="text-body-xs font-semibold text-text-high">{daysLeft}</div>
            <div className="text-caption text-text-secondary">jours</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg bg-surface-elevated/50 px-2 py-2"
          >
            <Pulse size={16} className="mx-auto mb-1 text-signal-success" weight="bold" />
            <div className="text-body-xs font-semibold text-text-high">Live</div>
            <div className="text-caption text-text-secondary">actif</div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {!isJoined ? (
            <Button
              onClick={onJoin}
              className="flex-1 bg-brand-electric hover:bg-brand-electric/90 text-surface-void"
            >
              Join
            </Button>
          ) : (
            <>
              <Button
                onClick={onLeaderboard}
                variant="outline"
                className="flex-1 border-surface-border bg-surface-elevated/50 hover:bg-surface-elevated text-text-high"
              >
                Leaderboard
              </Button>
              <Button
                onClick={onLeave}
                variant="ghost"
                className="flex-1 text-signal-error hover:bg-signal-error/10 hover:text-signal-error"
              >
                Leave
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
