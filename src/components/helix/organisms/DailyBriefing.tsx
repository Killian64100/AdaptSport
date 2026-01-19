'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkle, ArrowsClockwise } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import { getStaticSummary } from '@/utils/healthUtils'

export default function DailyBriefing() {
  const router = useRouter()
  const [briefingText, setBriefingText] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [useStaticFallback, setUseStaticFallback] = useState(false)

  // Get current health data from store for static fallback
  const { recovery, strain, hrv, rhr, sleep, spo2, calories } = useBiomarkerStore()

  // Generate static summary when data changes or fallback is needed
  useEffect(() => {
    if (useStaticFallback) {
      const staticSummary = getStaticSummary({
        recovery,
        strain,
        hrv,
        rhr,
        sleep,
        spo2,
        calories,
      })
      setBriefingText(staticSummary)
      setConfidence(50) // Static confidence = 50%
    }
  }, [recovery, strain, hrv, rhr, sleep, spo2, calories, useStaticFallback])

  // Fetch AI-generated briefing on mount and when health metrics change
  useEffect(() => {
    fetchBriefing()
  }, [recovery, hrv, sleep]) // Re-generate when key metrics change

  const fetchBriefing = async () => {
    setIsLoading(true)
    setUseStaticFallback(false)
    
    // Vérifier si on a eu une erreur 402 récemment (< 5 min)
    const lastError402 = localStorage.getItem('api_error_402_timestamp')
    if (lastError402) {
      const timeSinceError = Date.now() - parseInt(lastError402)
      const fiveMinutes = 5 * 60 * 1000
      
      if (timeSinceError < fiveMinutes) {
        console.warn('⏳ Erreur 402 récente, utilisation du fallback local')
        setUseStaticFallback(true)
        const staticSummary = getStaticSummary({
          recovery,
          strain,
          hrv,
          rhr,
          sleep,
          spo2,
          calories,
        })
        setBriefingText(staticSummary)
        setConfidence(50)
        setIsLoading(false)
        return
      } else {
        // Plus de 5 min, on réessaie et on efface le cache
        localStorage.removeItem('api_error_402_timestamp')
      }
    }
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'summary' }),
      })

      if (!response.ok) {
        // Enregistrer l'erreur 402 pour éviter de rappeler l'API pendant 5 min
        if (response.status === 402) {
          localStorage.setItem('api_error_402_timestamp', Date.now().toString())
          console.warn('💳 Erreur 402 détectée - cache activé pour 5 minutes')
        }
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      
      // Check if response is valid
      if (!data.response || data.response.includes('erreur') || data.response.includes('Erreur')) {
        throw new Error('Invalid API response')
      }
      
      setBriefingText(data.response)
      setConfidence(data.confidence)
      setUseStaticFallback(false)
    } catch (error) {
      console.warn('⚠️ API failed, using static fallback:', error)
      // Activer le fallback statique IMMÉDIATEMENT
      setUseStaticFallback(true)
      const staticSummary = getStaticSummary({
        recovery,
        strain,
        hrv,
        rhr,
        sleep,
        spo2,
        calories,
      })
      setBriefingText(staticSummary)
      setConfidence(50)
    } finally {
      // TOUJOURS forcer isLoading = false pour afficher le résumé
      setIsLoading(false)
    }
  }

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      fetchBriefing()
      setIsRegenerating(false)
    }, 800)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-surface-card p-6"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              rotate: isRegenerating ? 360 : [0, 5, -5, 0],
              scale: isRegenerating ? [1, 1.2, 1] : 1,
            }}
            transition={{ 
              duration: isRegenerating ? 0.8 : 2, 
              repeat: isRegenerating ? 0 : Infinity, 
              repeatDelay: 3 
            }}
          >
            <Sparkle size={20} weight="fill" className="text-brand-electric" />
          </motion.div>
          <h3 className="font-display text-body-l font-semibold text-text-highest">
            Daily Summary
          </h3>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="rounded-lg bg-surface-elevated p-2 text-text-medium transition-colors hover:bg-surface-modal hover:text-text-high disabled:opacity-50"
        >
          <motion.div
            animate={{ rotate: isRegenerating ? 360 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <ArrowsClockwise size={16} weight="bold" />
          </motion.div>
        </button>
      </div>

      {/* Generated Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={briefingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="leading-relaxed text-body-m text-text-high"
        >
          {isLoading ? (
            <span className="text-text-medium">Loading...</span>
          ) : (
            <span className={useStaticFallback ? "text-text-high" : "italic text-brand-electric"}>
              {briefingText}
            </span>
          )}
        </motion.p>
      </AnimatePresence>

      {/* AI Confidence Badge */}
      {!isLoading && confidence > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center gap-2"
        >
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-elevated">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full bg-brand-electric"
            />
          </div>
          <span className="text-caption text-text-medium">
            {confidence}% confidence {useStaticFallback && '(local mode)'}
          </span>
        </motion.div>
      )}

      {/* Details Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/dashboard/briefing-details')}
        className="mt-4 text-body-s font-medium text-brand-electric hover:underline"
      >
        View details →
      </motion.button>
    </motion.div>
  )
}
