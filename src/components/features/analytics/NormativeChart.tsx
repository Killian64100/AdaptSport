'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  ScatterChart,
  ComposedChart,
} from 'recharts'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import mockData from '@/data/mock-health.json'
import CoachInsight from '@/components/features/analytics/CoachInsight'

// Convertit une chaîne horaire (ex: "7h30") en nombre décimal (ex: 7.5)
const timeToDecimal = (timeString: string | number): number => {
  // Si c'est déjà un nombre, le retourner
  if (typeof timeString === 'number') return timeString
  
  // Parse le format "7h30" ou "7h30 h"
  const match = timeString.match(/(\d+)h(\d+)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  
  return hours + minutes / 60
}

// Fonction de distribution cumulative (CDF) pour une loi normale
function normalCDF(x: number, mean: number, stdDev: number): number {
  const z = (x - mean) / stdDev
  // Approximation de la fonction d'erreur (erf)
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp(-z * z / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

// Génération distribution normale (Bell Curve) - densité de probabilité
const generateNormalDistribution = (
  mean: number,
  stdDev: number,
  userValue: number
) => {
  const data = []
  const range = 4 * stdDev
  const step = range / 50

  // Première passe : calculer les valeurs brutes
  const rawData = []
  for (let x = mean - range / 2; x <= mean + range / 2; x += step) {
    const z = (x - mean) / stdDev
    const y = Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI))
    rawData.push({
      value: x,
      frequency: y,
    })
  }

  // Trouver le maximum pour normaliser (le pic sera à 100)
  const maxFrequency = Math.max(...rawData.map(d => d.frequency))

  // Deuxième passe : normaliser pour que le pic soit à 100
  rawData.forEach(point => {
    data.push({
      value: point.value,
      frequency: (point.frequency / maxFrequency) * 100, // Pic à 100
      isUser: false,
    })
  })

  // Trouver le point le PLUS PROCHE de la valeur utilisateur
  let closestIndex = 0
  let minDistance = Infinity
  
  data.forEach((point, index) => {
    const distance = Math.abs(point.value - userValue)
    if (distance < minDistance) {
      minDistance = distance
      closestIndex = index
    }
  })
  
  // Marquer uniquement le point le plus proche
  if (data[closestIndex]) {
    data[closestIndex].isUser = true
  }

  return data
}

// Custom Dot for user position
const UserPositionDot = (props: any) => {
  const { cx, cy, payload } = props
  if (!payload.isUser) return null

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="#2F80ED"
        stroke="#050505"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={4} fill="#00E5FF" />
    </g>
  )
}

export default function NormativeChart() {
  const { hrv, rhr, sleep, recovery } = useBiomarkerStore()
  const [selectedMetric, setSelectedMetric] = useState<'hrv' | 'rhr' | 'sleep' | 'recovery'>('hrv')
  
  // Mapping des métriques disponibles
  const metricValues: Record<string, number> = {
    hrv,
    rhr,
    sleep,
    recovery
  }

  // Metric options for tabs (Order: HRV, Sleep, Recovery, RHR)
  const metricOptions = [
    { id: 'hrv' as const, label: 'HRV' },
    { id: 'sleep' as const, label: 'Sleep' },
    { id: 'recovery' as const, label: 'Recovery' },
    { id: 'rhr' as const, label: 'RHR' },
  ]

  const userValue = metricValues[selectedMetric]
  const benchmark = (mockData.benchmarks as any)[selectedMetric]
  const metricInfo = (mockData.metrics as any)[selectedMetric]
  const profile = mockData.profile

  // Convertir les valeurs de benchmark si c'est le sommeil (format "7h12" → 7.2)
  const cohortMean = selectedMetric === 'sleep' ? timeToDecimal(benchmark.cohort_mean) : benchmark.cohort_mean
  const cohortStdDev = selectedMetric === 'sleep' ? timeToDecimal(benchmark.cohort_stddev) : benchmark.cohort_stddev
  const percentile = benchmark.percentile

  const data = generateNormalDistribution(cohortMean, cohortStdDev, userValue)
  
  // Point utilisateur isolé pour le Scatter
  const userPoint = data.find(d => d.isUser)
  const userScatterData = userPoint ? [{ value: userPoint.value, frequency: userPoint.frequency }] : []

  // Calculer le VRAI percentile avec la CDF (fonction de distribution cumulative)
  // Pour VFC et Sommeil : plus c'est haut, mieux c'est
  // Pour FC Repos : plus c'est bas, mieux c'est
  const cdfValue = normalCDF(userValue, cohortMean, cohortStdDev)
  
  // Pour VFC, Sommeil, Récupération : CDF directe (valeur haute = bon percentile)
  // Pour RHR : inverser (valeur basse = bon percentile)
  let actualPercentile: number
  if (selectedMetric === 'rhr') {
    // Pour FC au repos, inverser la logique
    actualPercentile = Math.round((1 - cdfValue) * 100)
  } else {
    // Pour VFC, Sommeil, Récupération
    actualPercentile = Math.round(cdfValue * 100)
  }

  // Fonction pour arrondir selon la métrique
  const formatValue = (value: number): string => {
    if (selectedMetric === 'sleep') {
      // Sommeil : garder format "7h30"
      return decimalToTime(value)
    } else {
      // VFC, RHR, Recovery : arrondir à l'unité
      return Math.round(value).toString()
    }
  }

  // Convertit un nombre décimal (ex: 7.5) en chaîne horaire (ex: "7h30")
  const decimalToTime = (decimalHours: number): string => {
    const hours = Math.floor(decimalHours)
    const minutes = Math.round((decimalHours - hours) * 60)
    // Gère le cas où l'arrondi donne 60 minutes
    if (minutes === 60) return `${hours + 1}h00`
    // Ajoute un zéro devant les minutes si nécessaire (ex: 7h05)
    return `${hours}h${minutes.toString().padStart(2, '0')}`
  }

  // Configuration spécifique pour la métrique Sommeil
  const isSleep = selectedMetric === 'sleep'
  const isRHR = selectedMetric === 'rhr'
  const xAxisConfig = isSleep ? {
    domain: [6, 10] as [number, number],
    ticks: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    tickFormatter: decimalToTime,
    reversed: false,
  } : {
    domain: undefined,
    ticks: undefined,
    tickFormatter: undefined,
    reversed: isRHR, // Inverser l'axe pour FC Repos (valeur basse = meilleur)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-surface-card p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="mb-2 font-display text-body-l font-semibold text-text-highest">
          Peer Comparison
        </h3>
        <p className="text-body-s text-text-medium">
          {profile.gender === 'male' ? 'Men' : 'Women'}, {profile.age - 2}-{profile.age + 2} years old, {profile.activity_level === 'active' ? 'active' : 'moderate'}
        </p>
      </div>

      {/* Metric Selector Tabs */}
      <div className="mb-6 flex gap-2 rounded-lg bg-surface-elevated p-1">
        {metricOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedMetric(option.id)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              selectedMetric === option.id
                ? 'bg-brand-electric text-text-highest shadow-sm'
                : 'text-text-medium hover:text-text-high'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Percentile Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 rounded-lg bg-surface-elevated p-4"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-body-m text-text-medium">You are in the</span>
          <span className="font-display text-display-s text-brand-electric">
            top {100 - actualPercentile}%
          </span>
        </div>
        <p className="mt-2 text-body-s text-text-high">
          Your {metricInfo.name} is higher than {actualPercentile}% of users in your profile
        </p>
      </motion.div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 5, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="distributionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F80ED" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2F80ED" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#242424"
              vertical={false}
            />

            <XAxis
              dataKey="value"
              stroke="#A0A0A0"
              style={{ fontSize: '12px', fill: '#A0A0A0' }}
              tick={{ fill: '#A0A0A0' }}
              tickLine={{ stroke: '#6B6B6B' }}
              tickSize={5}
              domain={xAxisConfig.domain}
              ticks={xAxisConfig.ticks}
              interval={isSleep ? 0 : 'preserveStartEnd'}
              tickFormatter={xAxisConfig.tickFormatter || ((value) => Math.round(value).toString())}
              reversed={xAxisConfig.reversed}
              label={{
                value: `${metricInfo.name} (${metricInfo.unit})`,
                position: 'insideBottom',
                offset: 0,
                style: { fill: '#A0A0A0', fontSize: '12px' },
              }}
            />

            <YAxis
              stroke="#6B6B6B"
              style={{ fontSize: '12px' }}
              tickLine={false}
              domain={[0, 100]}
              hide
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#242424',
                border: 'none',
                borderRadius: '8px',
                color: '#F2F2F2',
              }}
              labelStyle={{ color: '#A0A0A0' }}
              formatter={(value: any, name: string) => {
                // Ne pas afficher la fréquence (densité de probabilité), inutile pour l'utilisateur
                return null
              }}
              labelFormatter={(label: any) => {
                if (isSleep) {
                  return `Durée: ${decimalToTime(label)}`
                }
                return `${metricInfo.name}: ${Math.round(label)} ${metricInfo.unit}`
              }}
            />

            {/* Distribution Area - Courbe gaussienne normalisée 0-100% */}
            <Area
              type="monotone"
              dataKey="frequency"
              stroke="#2F80ED"
              strokeWidth={2}
              fill="url(#distributionGradient)"
              dot={(props: any) => {
                const { cx, cy, payload } = props
                // Afficher uniquement le point de l'utilisateur
                if (!payload.isUser) return null
                return (
                  <g style={{ zIndex: 1000 }}>
                    {/* Glow effect */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={12}
                      fill="#00E5FF"
                      opacity={0.2}
                    />
                    {/* Outer ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill="#2F80ED"
                      stroke="#050505"
                      strokeWidth={2}
                    />
                    {/* Inner bright dot */}
                    <circle cx={cx} cy={cy} r={4} fill="#00E5FF" />
                  </g>
                )
              }}
              isAnimationActive={true}
              animationDuration={1200}
            />

            {/* Ligne moyenne - VERTICALE au pic de la gaussienne */}
            <ReferenceLine
              x={cohortMean}
              stroke="#A0A0A0"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: 'Moyenne',
                position: 'top',
                fill: '#F2F2F2',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-caption">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-brand-electric" />
          <span className="text-text-medium">Your position</span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-caption text-text-low">
        Aggregated and anonymized data. No names visible.
      </p>
    </motion.div>
  )
}
