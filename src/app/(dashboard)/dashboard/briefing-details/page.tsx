'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkle } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

export default function BriefingDetailsPage() {
  const router = useRouter()
  const [detailedAnalysis, setDetailedAnalysis] = useState('')
  const [glossary, setGlossary] = useState<{ term: string; definition: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDetailedAnalysis()
  }, [])

  const fetchDetailedAnalysis = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'detailed-summary' }),
      })

      const data = await response.json()
      setDetailedAnalysis(data.response)
      setGlossary(data.glossary || [])
    } catch (error) {
      console.error('Failed to fetch detailed analysis:', error)
      setDetailedAnalysis("Detailed analysis in progress...")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-void pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pb-6 pt-12"
        style={{ paddingTop: 'max(3rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-body-m text-brand-electric transition-colors hover:text-data-hrv"
        >
          <ArrowLeft size={20} weight="bold" />
          Back to dashboard
        </button>

        <div className="flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-brand-electric" />
          <h1 className="font-display text-display-s text-text-highest">
            Detailed Daily Analysis
          </h1>
        </div>
      </motion.header>

      {/* Detailed Analysis */}
      <div className="px-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-surface-card p-6"
        >
          <h2 className="mb-4 font-display text-body-l font-semibold text-text-highest">
            Complete Physiological Analysis
          </h2>
          {isLoading ? (
            <div className="flex items-center gap-2 text-text-medium">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkle size={16} weight="fill" className="text-brand-electric" />
              </motion.div>
              <span>Analysis in progress...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {detailedAnalysis.split('\n\n').map((paragraph, index) => (
                <p 
                  key={index} 
                  className="leading-relaxed text-body-m text-text-high"
                  dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-brand-electric font-semibold">$1</strong>')
                      .replace(/\*(.+?)\*/g, '<em class="italic text-brand-electric">$1</em>')
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Glossary Section */}
        {!isLoading && glossary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-surface-card p-6"
          >
            <h2 className="mb-4 font-display text-body-l font-semibold text-text-highest">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {glossary.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="rounded-lg bg-surface-elevated p-4"
                >
                  <h3 className="mb-2 font-semibold text-body-m text-brand-electric">
                    {item.term}
                  </h3>
                  <p className="text-body-s text-text-medium leading-relaxed">
                    {item.definition}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-surface-card p-6"
        >
          <h2 className="mb-4 font-display text-body-l font-semibold text-text-highest">
            Key Metrics Explained
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-body-m text-text-high">HRV (Heart Rate Variability)</span>
                <span className="font-mono text-mono-m text-brand-electric">58 ms</span>
              </div>
              <p className="text-caption text-text-medium">
                Measures the variation in time between each heartbeat. The higher it is, the more balanced your nervous system and ready for effort.
              </p>
            </div>

            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-body-m text-text-high">Recovery</span>
                <span className="font-mono text-mono-m text-brand-electric">72%</span>
              </div>
              <p className="text-caption text-text-medium">
                Overall score indicating how well your body has recovered from recent efforts. 70%+ = green, 50-70% = caution, &lt;50% = rest recommended.
              </p>
            </div>

            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-body-m text-text-high">Strain (Effort Load)</span>
                <span className="font-mono text-mono-m text-brand-electric">10.2/21</span>
              </div>
              <p className="text-caption text-text-medium">
                Measures the cumulative intensity of your daily activities. The higher the number, the more you're taxing your body. Scale from 0 (total rest) to 21 (maximum effort).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
