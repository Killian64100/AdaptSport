'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Pulse, Lightning } from '@phosphor-icons/react'
import { useState } from 'react'
import ChallengeCard from './ChallengeCard'
import Leaderboard from './Leaderboard'

interface Challenge {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  participants: number
  daysLeft: number
  isJoined?: boolean
}

interface LeaderboardEntry {
  rank: number
  pseudonym: string
  score: number
  trend: 'up' | 'down' | 'neutral'
  isCurrentUser?: boolean
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '7-Day HRV Challenge',
    description: 'Increase your heart rate variability by 15%',
    icon: <Lightning size={32} weight="fill" />,
    participants: 342,
    daysLeft: 4,
    isJoined: true,
  },
  {
    id: '2',
    title: 'Morning Walk',
    description: '10,000 steps before 10am for 7 days',
    icon: <Pulse size={32} weight="fill" />,
    participants: 1205,
    daysLeft: 2,
  },
  {
    id: '3',
    title: 'Zen Meditation',
    description: '30 min of conscious breathing daily',
    icon: <Trophy size={32} weight="fill" />,
    participants: 856,
    daysLeft: 6,
  },
]

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, pseudonym: 'PhoenixX', score: 2850, trend: 'up', isCurrentUser: false },
  { rank: 2, pseudonym: 'AthleteBlue', score: 2720, trend: 'neutral', isCurrentUser: false },
  { rank: 3, pseudonym: 'VortexMind', score: 2610, trend: 'down', isCurrentUser: true },
  { rank: 4, pseudonym: 'NexusWave', score: 2505, trend: 'up', isCurrentUser: false },
  { rank: 5, pseudonym: 'ZenithCore', score: 2412, trend: 'up', isCurrentUser: false },
  // ... up to 30+ entries
]

export default function ChallengesList() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, isJoined: true, participants: c.participants + 1 }
        : c
    ))
  }

  const handleLeaveChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, isJoined: false, participants: Math.max(0, c.participants - 1) }
        : c
    ))
  }

  const handleShowLeaderboard = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setLeaderboardOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={24} weight="fill" className="text-signal-caution" />
          <h2 className="text-title-lg font-bold text-text-high">Anonymous Challenges</h2>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard
                {...challenge}
                onJoin={() => handleJoinChallenge(challenge.id)}
                onLeave={() => handleLeaveChallenge(challenge.id)}
                onLeaderboard={() => handleShowLeaderboard(challenge)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {challenges.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-surface-border bg-surface-elevated/50 p-8 text-center"
        >
          <Trophy size={48} className="mx-auto mb-4 text-text-tertiary" />
          <h3 className="mb-2 font-bold text-text-high">No Challenges Available</h3>
          <p className="text-body-xs text-text-secondary">
            Check back soon to discover new challenges
          </p>
        </motion.div>
      )}

      {/* Leaderboard Modal */}
      <Leaderboard
        entries={mockLeaderboard}
        isOpen={leaderboardOpen}
        onOpenChange={setLeaderboardOpen}
        challengeTitle={selectedChallenge?.title}
      />
    </motion.div>
  )
}
