'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, MagnifyingGlass, User } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { generateGeometricAvatar } from '@/lib/avatarGenerator'
import { useState } from 'react'

interface LeaderboardEntry {
  rank: number
  pseudonym: string
  score: number
  trend: 'up' | 'down' | 'neutral'
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  challengeTitle?: string
}

export default function Leaderboard({ 
  entries, 
  isOpen, 
  onOpenChange,
  challengeTitle 
}: LeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEntries = entries.filter((entry) =>
    entry.pseudonym.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.rank.toString().includes(searchQuery)
  )

  const getPercentile = (rank: number, total: number) => {
    const percentile = Math.round(((total - rank + 1) / total) * 100)
    if (percentile >= 90) return 'Elite'
    if (percentile >= 75) return 'Advanced'
    if (percentile >= 50) return 'Intermediate'
    if (percentile >= 25) return 'Developing'
    return 'Foundational'
  }

  const getPercentileColor = (rank: number, total: number) => {
    const percentile = Math.round(((total - rank + 1) / total) * 100)
    if (percentile >= 90) return 'text-signal-success'
    if (percentile >= 75) return 'text-brand-electric'
    if (percentile >= 50) return 'text-signal-caution'
    return 'text-signal-critical'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy size={24} weight="fill" className="text-brand-electric" />
            {challengeTitle || 'Your Ranking'}
          </DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-4"
        >
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search for a username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-surface-elevated pl-9 pr-3 py-2 text-body-xs placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-electric/50"
          />
        </motion.div>

        {/* Leaderboard entries */}
        <motion.div className="max-h-96 space-y-2 overflow-y-auto">
          <AnimatePresence>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <motion.div
                  key={entry.pseudonym}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`relative rounded-lg p-3 transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-brand-electric/10 border border-brand-electric/30'
                      : 'bg-surface-elevated hover:bg-surface-elevated/80'
                  }`}
                >
                  {/* Rank badge */}
                  <div className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-card border border-text-medium/20">
                    <span className="text-caption font-bold text-text-medium">
                      #{entry.rank}
                    </span>
                  </div>

                  <div className="ml-6 flex items-center justify-between">
                    {/* Avatar and pseudonym */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-card">
                        {generateGeometricAvatar(entry.pseudonym)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text-high text-body-xs truncate">
                          {entry.pseudonym}
                        </div>
                        <div className="text-caption text-text-secondary">
                          {entry.isCurrentUser && '• Vous'}
                        </div>
                      </div>
                    </div>

                    {/* Score with percentile tier */}
                    <div className="text-right">
                      <div className={`font-bold text-title-sm ${getPercentileColor(entry.rank, entries.length)}`}>
                        Top {Math.round(((entries.length - entry.rank + 1) / entries.length) * 100)}%
                      </div>
                      <div className="text-caption text-text-secondary">
                        {getPercentile(entry.rank, entries.length)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center text-text-secondary"
              >
                <MagnifyingGlass
                  size={32}
                  className="mx-auto mb-2 text-text-tertiary"
                />
                <p className="text-body-xs">Aucun résultat trouvé</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Privacy & methodology notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-lg bg-signal-info/10 p-3 border border-signal-info/20"
        >
          <p className="text-caption text-text-medium">
            ✓ Anonymous comparison based on HRV and physiological metrics. Leaderboard updated daily.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
