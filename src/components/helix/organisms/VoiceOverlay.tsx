'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Microphone } from '@phosphor-icons/react'

interface VoiceOverlayProps {
  isOpen: boolean
  onClose: () => void
  onCommand: (command: string) => void
}

export default function VoiceOverlay({ isOpen, onClose, onCommand }: VoiceOverlayProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setIsListening(true)
      // Simulate voice recognition
      const timeout = setTimeout(() => {
        simulateVoiceRecognition()
      }, 1500)

      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  const simulateVoiceRecognition = () => {
    const commands = [
      'Log un sauna de 20 minutes',
      'Démarrer une séance de méditation',
      'Afficher ma VFC',
      'Créer un plan d\'entraînement',
    ]

    const randomCommand = commands[Math.floor(Math.random() * commands.length)]
    
    // Simulate typing effect
    let currentText = ''
    const interval = setInterval(() => {
      if (currentText.length < randomCommand.length) {
        currentText += randomCommand[currentText.length]
        setTranscript(currentText)
        setConfidence(Math.min(95, (currentText.length / randomCommand.length) * 100))
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onCommand(randomCommand)
          onClose()
        }, 800)
      }
    }, 50)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md px-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-4 rounded-full bg-surface-card p-3 text-text-medium transition-colors hover:bg-surface-elevated hover:text-text-high"
            >
              <X size={24} weight="bold" />
            </button>

            {/* Voice Card */}
            <div className="rounded-2xl bg-surface-elevated p-8">
              {/* Waveform Animation */}
              <div className="mb-8 flex items-center justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scaleY: isListening ? [1, 2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isListening ? Infinity : 0,
                      delay: i * 0.1,
                    }}
                    className="w-1.5 h-16 bg-brand-electric rounded-full"
                  />
                ))}
              </div>

              {/* Microphone Icon */}
              <motion.div
                animate={{
                  scale: isListening ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isListening ? Infinity : 0,
                }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-electric/20"
              >
                <Microphone size={48} weight="fill" className="text-brand-electric" />
              </motion.div>

              {/* Status Text */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4 text-center text-body-l font-medium text-text-highest"
              >
                {isListening ? 'À l\'écoute...' : 'Traitement...'}
              </motion.p>

              {/* Transcript */}
              <AnimatePresence>
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-surface-card p-4"
                  >
                    <p className="mb-2 text-body-m text-text-high">
                      "{transcript}"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${confidence}%` }}
                          className="h-full bg-signal-success"
                        />
                      </div>
                      <span className="text-caption text-text-medium">
                        {Math.round(confidence)}%
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hint */}
              {!transcript && (
                <p className="mt-4 text-center text-body-s text-text-medium">
                  Dites votre commande
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
