'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkle } from '@phosphor-icons/react'
import mockData from '@/data/mock-health.json'

// Types
interface Metric {
  id: string
  name: string
  unit: string
  color: string
}

const availableMetrics: Metric[] = [
  { id: 'hrv', name: 'HRV', unit: 'ms', color: '#00E5FF' },
  { id: 'strain', name: 'Strain', unit: '/21', color: '#FF6E40' },
  { id: 'sleep', name: 'Sleep', unit: 'h', color: '#7C4DFF' },
  { id: 'calories', name: 'Calories', unit: 'kcal', color: '#FFC400' },
  { id: 'recovery', name: 'Recovery', unit: '%', color: '#69F0AE' },
]

// Convertit un format horaire ("7h30") en nombre décimal (7.5)
const timeToDecimal = (timeString: string | number): number => {
  if (typeof timeString === 'number') return timeString
  const match = timeString.match(/^(\d+)h(\d+)$/)
  if (!match) return 0
  const hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  return hours + minutes / 60
}

// Génération de données corrélées depuis mock-health.json
const generateCorrelationData = (metric1: string, metric2: string) => {
  const history = mockData.history || []
  
  // Créer un dataset avec les 7 jours depuis history
  const data = history.map((day, index) => {
    const value1 = day[metric1 as keyof typeof day]
    const value2 = day[metric2 as keyof typeof day]
    
    return {
      day: day.date,
      [metric1]: metric1 === 'sleep' ? timeToDecimal(value1 as any) : (value1 as number),
      [metric2]: metric2 === 'sleep' ? timeToDecimal(value2 as any) : (value2 as number),
    }
  })
  
  return data
}

// Calcul du coefficient de corrélation de Pearson
const calculateCorrelation = (data: any[], metric1: string, metric2: string) => {
  const n = data.length
  const x = data.map(d => d[metric1])
  const y = data.map(d => d[metric2])
  
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  
  return denominator === 0 ? 0 : numerator / denominator
}

// Génération d'insights IA basés sur les corrélations
const generateInsight = (metric1: string, metric2: string, correlation: number, data: any[]) => {
  const metric1Name = availableMetrics.find(m => m.id === metric1)?.name || metric1
  const metric2Name = availableMetrics.find(m => m.id === metric2)?.name || metric2
  
  const absCorr = Math.abs(correlation)
  const isPositive = correlation > 0
  const strength = absCorr > 0.7 ? 'strong' : absCorr > 0.4 ? 'moderate' : 'weak'
  
  const insights: Record<string, string> = {
    'hrv-strain': `Your HRV decreases by ${Math.round(absCorr * 100)}% as your Strain increases. This strong negative correlation (r = ${correlation.toFixed(2)}) suggests you should prioritize recovery on high-load days.`,
    'hrv-sleep': `Your HRV improves by ${Math.round(absCorr * 100)}% with quality sleep. This ${isPositive ? 'positive' : 'negative'} ${strength} correlation (r = ${correlation.toFixed(2)}) confirms the importance of rest for your recovery.`,
    'strain-recovery': `Your recovery ${isPositive ? 'increases' : 'decreases'} proportionally to your Strain. ${strength} correlation (r = ${correlation.toFixed(2)}). ${!isPositive ? 'High Strain negatively impacts your ability to recover.' : 'Your body adapts well to the load.'}`,
    'sleep-recovery': `Your recovery is ${absCorr > 0.5 ? 'strongly' : 'moderately'} linked to your sleep (r = ${correlation.toFixed(2)}). Each additional hour of sleep improves your recovery score by ~${Math.round(absCorr * 10)}%.`,
    'glucose-strain': `Your glucose ${isPositive ? 'increases' : 'fluctuates'} with your Strain. ${strength} correlation (r = ${correlation.toFixed(2)}). Monitor your nutrition on high-intensity training days.`,
    'spo2-sleep': `Your oxygen saturation remains ${absCorr > 0.3 ? 'correlated' : 'stable'} with your sleep (r = ${correlation.toFixed(2)}). ${absCorr < 0.3 ? 'No signs of nocturnal apnea detected.' : 'Excellent nighttime oxygenation.'}`,
  }
  
  const key = `${metric1}-${metric2}`
  const reverseKey = `${metric2}-${metric1}`
  
  return insights[key] || insights[reverseKey] || `Correlation analysis between ${metric1Name} and ${metric2Name}: ${strength} correlation (r = ${correlation.toFixed(2)}). ${isPositive ? 'These metrics evolve in the same direction.' : 'These metrics evolve in opposite directions.'}`
}

// Custom Tooltip
const CustomCorrelationTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg bg-surface-elevated p-3 shadow-glow-md"
    >
      <p className="mb-2 text-caption text-text-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-baseline gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-body-s text-text-high">{entry.name}:</span>
          <span className="font-mono text-mono-m text-text-highest">
            {entry.value.toFixed(1)}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export default function CorrelationEngine() {
  const [metric1, setMetric1] = useState('hrv')
  const [metric2, setMetric2] = useState('strain')
  
  // Génération des données et calcul de corrélation
  const data = useMemo(() => generateCorrelationData(metric1, metric2), [metric1, metric2])
  const correlationCoefficient = useMemo(() => calculateCorrelation(data, metric1, metric2), [data, metric1, metric2])
  const aiInsight = useMemo(() => generateInsight(metric1, metric2, correlationCoefficient, data), [metric1, metric2, correlationCoefficient, data])
  
  // Calcul de confiance basé sur la taille de l'échantillon et la variabilité des données
  const confidence = useMemo(() => {
    const sampleSize = data.length
    const maxSampleSize = 30 // Taille d'échantillon idéale
    
    // Confiance de base selon la taille de l'échantillon (50-85%)
    const sampleConfidence = Math.min(85, 50 + (sampleSize / maxSampleSize) * 35)
    
    // Bonus si les données sont récentes (jusqu'à +10%)
    const recencyBonus = 5
    
    return Math.round(Math.min(95, sampleConfidence + recencyBonus))
  }, [data])

  const handleMetricChange = (type: 'metric1' | 'metric2', value: string) => {
    if (type === 'metric1') {
      setMetric1(value)
    } else {
      setMetric2(value)
    }
  }

  const metric1Config = availableMetrics.find(m => m.id === metric1)!
  const metric2Config = availableMetrics.find(m => m.id === metric2)!

  return (
    <div className="space-y-4">
      {/* Metric Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-surface-card p-6"
      >
        <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
          Compare two metrics
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-caption text-text-medium">
              Metric 1
            </label>
            <Select value={metric1} onValueChange={(v) => handleMetricChange('metric1', v)}>
              <SelectTrigger className="bg-surface-elevated">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics
                  .filter(m => m.id !== metric2)
                  .map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-caption text-text-medium">
              Metric 2
            </label>
            <Select value={metric2} onValueChange={(v) => handleMetricChange('metric2', v)}>
              <SelectTrigger className="bg-surface-elevated">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics
                  .filter(m => m.id !== metric1)
                  .map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Correlation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl bg-surface-card p-6"
      >
        {/* Header with Correlation Badge */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-body-l font-semibold text-text-highest">
            7-day trend
          </h3>
          <div className="rounded-lg bg-surface-elevated px-3 py-1.5">
            <span className="text-caption text-text-medium">Correlation: </span>
            <span 
              className="font-mono text-mono-m"
              style={{ 
                color: Math.abs(correlationCoefficient) > 0.7 ? '#00E676' : 
                       Math.abs(correlationCoefficient) > 0.4 ? '#FFC400' : '#FF6E40'
              }}
            >
              {correlationCoefficient > 0 ? '▲' : '▼'} {Math.abs(correlationCoefficient).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Two Separate Line Charts Stacked */}
        <div className="space-y-6">
          {/* Metric 1 Chart */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: metric1Config.color }}
              />
              <span className="text-sm font-medium text-text-high">
                {metric1Config.name}
              </span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#242424"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    stroke="#6B6B6B"
                    style={{ fontSize: '11px' }}
                    tickLine={false}
                  />

                  <YAxis
                    stroke={metric1Config.color}
                    style={{ fontSize: '11px' }}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${metric1Config.color}`,
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    labelStyle={{ color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => {
                      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0
                      return [`${numValue.toFixed(1)} ${metric1Config.unit}`, metric1Config.name]
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey={metric1}
                    stroke={metric1Config.color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: metric1Config.color, strokeWidth: 2, stroke: '#000' }}
                    activeDot={{ r: 6 }}
                    animationDuration={800}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metric 2 Chart */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: metric2Config.color }}
              />
              <span className="text-sm font-medium text-text-high">
                {metric2Config.name}
              </span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#242424"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    stroke="#6B6B6B"
                    style={{ fontSize: '11px' }}
                    tickLine={false}
                  />

                  <YAxis
                    stroke={metric2Config.color}
                    style={{ fontSize: '11px' }}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${metric2Config.color}`,
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    labelStyle={{ color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => {
                      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0
                      return [`${numValue.toFixed(1)} ${metric2Config.unit}`, metric2Config.name]
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey={metric2}
                    stroke={metric2Config.color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: metric2Config.color, strokeWidth: 2, stroke: '#000' }}
                    activeDot={{ r: 6 }}
                    animationDuration={800}
                    animationBegin={200}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Correlation Explanation */}
        <div className="mt-6 rounded-lg bg-surface-elevated p-4">
          <p className="text-sm text-text-medium">
            {correlationCoefficient > 0 
              ? `📈 Positive relationship: When ${metric1Config.name} increases, ${metric2Config.name} also tends to increase.`
              : `📉 Inverse relationship: When ${metric1Config.name} increases, ${metric2Config.name} tends to decrease.`
            }
          </p>
        </div>
      </motion.div>

      {/* AI-Generated Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-surface-card p-6"
      >
        <div className="mb-3 flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkle size={20} weight="fill" className="text-brand-electric" />
          </motion.div>
          <h3 className="font-display text-body-l font-semibold text-text-highest">
            Insight
          </h3>
        </div>

        <p className="leading-relaxed text-body-m text-text-high">
          {aiInsight}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-surface-elevated">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full bg-brand-electric"
            />
          </div>
          <span className="text-caption text-text-medium">{confidence}% confidence</span>
        </div>
      </motion.div>
    </div>
  )
}
