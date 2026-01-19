'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, ArrowCounterClockwise } from '@phosphor-icons/react'

interface ProtocolTimerProps {
  duration: number // seconds
  isActive: boolean
  onToggle: () => void
}

export default function ProtocolTimer({ duration, isActive, onToggle }: ProtocolTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      onToggle()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, onToggle])

  const handleReset = () => {
    setTimeLeft(duration)
  }

  const progress = ((duration - timeLeft) / duration) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-surface-card p-8"
    >
      {/* Circular Timer */}
      <div className="relative mx-auto mb-8 h-64 w-64">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-surface-elevated"
          />

          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-brand-electric"
            style={{
              strokeDasharray: 2 * Math.PI * 45,
            }}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
            stroke="url(#timerGradient)"
          />

          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F80ED" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-display-l text-text-highest">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="mt-2 text-body-s text-text-medium">
            {isActive ? 'En cours' : 'En pause'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleReset}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-elevated text-text-medium transition-colors hover:bg-surface-modal hover:text-text-high"
        >
          <ArrowCounterClockwise size={24} weight="bold" />
        </button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-electric shadow-glow-md transition-shadow hover:shadow-glow-lg"
        >
          {isActive ? (
            <Pause size={32} weight="fill" className="text-surface-void" />
          ) : (
            <Play size={32} weight="fill" className="ml-1 text-surface-void" />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
