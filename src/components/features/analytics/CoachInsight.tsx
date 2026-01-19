'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkle, TrendUp, TrendDown, Minus } from '@phosphor-icons/react'

interface CoachInsightProps {
  metricType: string
  graphData?: number[]
  className?: string
}

export default function CoachInsight({ metricType, graphData, className = '' }: CoachInsightProps) {
  const [insight, setInsight] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [attribution, setAttribution] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable')

  useEffect(() => {
    fetchInsight()
  }, [metricType, graphData])

  const fetchInsight = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'graph',
          metricType,
          graphData,
        }),
      })

      const data = await response.json()
      
      // Check if response is valid
      if (data.response && typeof data.response === 'string') {
        setInsight(data.response)
        setConfidence(data.confidence || 0)
        setAttribution(data.attribution)

        // Determine trend from insight text
        const responseText = data.response.toLowerCase()
        if (responseText.includes('hausse') || 
            responseText.includes('augment') ||
            responseText.includes('progress')) {
          setTrend('up')
        } else if (responseText.includes('baisse') || 
                   responseText.includes('diminu') ||
                   responseText.includes('régress')) {
          setTrend('down')
        } else {
          setTrend('stable')
        }
      } else {
        // Handle error response from API
        setInsight(data.error || "Impossible de générer l'insight pour le moment.")
        setConfidence(0)
        setTrend('stable')
      }
    } catch (error) {
      console.error('Failed to fetch insight:', error)
      setInsight("Analysis in progress...")
      setConfidence(0)
    } finally {
      setIsLoading(false)
    }
  }

  const TrendIcon = trend === 'up' ? TrendUp : trend === 'down' ? TrendDown : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mt-4 rounded-lg border border-surface-elevated bg-surface-card/50 p-4 backdrop-blur-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              rotate: isLoading ? [0, 5, -5, 0] : 0,
              scale: isLoading ? [1, 1.1, 1] : 1,
            }}
            transition={{ 
              duration: 1.5, 
              repeat: isLoading ? Infinity : 0,
            }}
          >
            <Sparkle size={16} weight="fill" className="text-brand-electric" />
          </motion.div>
          <span className="text-caption font-medium text-text-medium">
            Insight Coach
          </span>
        </div>

        {/* Trend Badge */}
        {!isLoading && trend !== 'stable' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-caption ${
              trend === 'up' 
                ? 'bg-brand-green/20 text-brand-green' 
                : 'bg-brand-red/20 text-brand-red'
            }`}
          >
            <TrendIcon size={12} weight="bold" />
            <span>{trend === 'up' ? 'Progress' : 'Caution'}</span>
          </motion.div>
        )}
      </div>

      {/* Insight Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-body-s leading-relaxed text-text-high"
      >
        {isLoading ? (
          <span className="text-text-medium">Analyse des données en cours...</span>
        ) : (
          <span className="italic text-brand-electric">{insight}</span>
        )}
      </motion.p>

      {/* Attribution Factors */}
      {!isLoading && attribution && attribution.factors && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.4 }}
          className="mt-3 space-y-2 border-t border-surface-elevated pt-3"
        >
          <span className="text-caption text-text-medium">Facteurs d'influence :</span>
          <div className="space-y-1.5">
            {attribution.factors.map((factor: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between text-caption">
                    <span className="text-text-high">{factor.label}</span>
                    <span className={`font-medium ${
                      factor.direction === 'positive' 
                        ? 'text-brand-green' 
                        : factor.direction === 'negative'
                        ? 'text-brand-red'
                        : 'text-text-medium'
                    }`}>
                      {factor.impact}%
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-elevated">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.impact}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                      className={`h-full ${
                        factor.direction === 'positive' 
                          ? 'bg-brand-green' 
                          : factor.direction === 'negative'
                          ? 'bg-brand-red'
                          : 'bg-text-medium'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Confidence */}
      {!isLoading && confidence > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-3 flex items-center justify-end gap-2"
        >
          <div className="h-1 w-24 overflow-hidden rounded-full bg-surface-elevated">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-full bg-brand-electric"
            />
          </div>
          <span className="text-caption text-text-medium">{confidence}%</span>
        </motion.div>
      )}
    </motion.div>
  )
}
