'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ClockCounterClockwise, TrendUp } from '@phosphor-icons/react'
import mockData from '@/data/mock-health.json'

export default function RecoveryHistoryCard() {
  const history = mockData.history || []
  const recoveryHistory = history.map(day => day.recovery)
  
  // Préparer les données pour le graphique
  const chartData = history.map((day, index) => ({
    day: day.date,
    recovery: day.recovery
  }))

  // Calculer la tendance
  const firstValue = recoveryHistory[0]
  const lastValue = recoveryHistory[recoveryHistory.length - 1]
  const trend = lastValue - firstValue
  const trendPercentage = ((trend / firstValue) * 100).toFixed(1)

  // Calculer la moyenne
  const average = Math.round(recoveryHistory.reduce((a, b) => a + b, 0) / recoveryHistory.length)

  // Couleur dynamique selon la valeur actuelle
  const getColor = (value: number) => {
    if (value < 50) return '#FF3D00'
    if (value < 80) return '#FFC400'
    return '#00E676'
  }

  const currentColor = getColor(lastValue)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-surface-card p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-surface-elevated p-2">
            <ClockCounterClockwise weight="duotone" size={24} className="text-brand-electric" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-text-highest">
              Recovery History
            </h3>
            <p className="text-caption text-text-medium">Last 7 days</p>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-1 rounded-lg bg-surface-elevated px-3 py-1">
          <TrendUp
            weight="bold"
            size={16}
            style={{ color: trend >= 0 ? '#00E676' : '#FF3D00' }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: trend >= 0 ? '#00E676' : '#FF3D00' }}
          >
            {trend >= 0 ? '+' : ''}{trendPercentage}%
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-surface-elevated p-3 text-center">
          <div className="mb-1 text-caption text-text-medium">Current</div>
          <div className="font-display text-2xl font-bold" style={{ color: currentColor }}>
            {lastValue}%
          </div>
        </div>
        <div className="rounded-lg bg-surface-elevated p-3 text-center">
          <div className="mb-1 text-caption text-text-medium">Average</div>
          <div className="font-display text-2xl font-bold text-text-highest">
            {average}%
          </div>
        </div>
        <div className="rounded-lg bg-surface-elevated p-3 text-center">
          <div className="mb-1 text-caption text-text-medium">Min/Max</div>
          <div className="font-display text-2xl font-bold text-text-highest">
            {Math.min(...recoveryHistory)}/{Math.max(...recoveryHistory)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="day"
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 20, 30, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value: any) => [`${value}%`, 'Recovery']}
            />
            <Line
              type="monotone"
              dataKey="recovery"
              stroke={currentColor}
              strokeWidth={3}
              dot={{
                fill: currentColor,
                strokeWidth: 2,
                r: 4,
                stroke: 'rgba(0, 0, 0, 0.2)'
              }}
              activeDot={{
                r: 6,
                fill: currentColor,
                stroke: '#fff',
                strokeWidth: 2
              }}
              filter={`drop-shadow(0 0 8px ${currentColor})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 rounded-lg bg-surface-elevated p-4"
      >
        <p className="text-sm leading-relaxed text-text-high">
          {lastValue >= 80 && "Excellent! Your recovery is optimal. You can consider intensive training."}
          {lastValue >= 50 && lastValue < 80 && "Your recovery is moderate. Favor medium-intensity sessions."}
          {lastValue < 50 && "Your body needs rest. Prioritize active recovery and sleep."}
          {trend > 5 && " Your trend is very positive this week! 📈"}
          {trend < -5 && " Watch your training load this week. 📊"}
        </p>
      </motion.div>
    </motion.div>
  )
}
