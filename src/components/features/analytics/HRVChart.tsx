'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

// Génération de données simulées
const generateHRVData = () => {
  const baseline = 55
  const stdDev = 10
  const data = []

  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const randomVariation = (Math.random() - 0.5) * 20
    const value = Math.max(
      30,
      Math.min(80, baseline + randomVariation + Math.sin(i / 7) * 5)
    )

    data.push({
      date: format(date, 'dd MMM', { locale: fr }),
      fullDate: format(date, 'dd MMMM yyyy', { locale: fr }),
      value: Math.round(value),
      baselineMin: baseline - stdDev,
      baselineMax: baseline + stdDev,
      baseline,
    })
  }

  return data
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload[0]) return null

  const data = payload[0].payload
  const isInRange =
    data.value >= data.baselineMin && data.value <= data.baselineMax

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg bg-surface-elevated p-3 shadow-glow-md"
    >
      <p className="mb-1 text-caption text-text-medium">{data.fullDate}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-mono-l text-text-highest">
          {data.value}
        </span>
        <span className="text-caption text-text-medium">ms</span>
      </div>
      <p className={`mt-1 text-caption ${isInRange ? 'text-signal-success' : 'text-signal-critical'}`}>
        {isInRange ? 'Dans la zone normale' : 'Hors zone normale'}
      </p>
    </motion.div>
  )
}

export default function HRVChart() {
  const [data] = useState(generateHRVData())
  const baseline = data[0]?.baseline || 55

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-surface-card p-6"
    >
      {/* Legend */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-body-l font-semibold text-text-highest">
          HRV Trend
        </h3>
        <div className="flex items-center gap-4 text-caption">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-data-hrv" />
            <span className="text-text-medium">Current Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 rounded-sm bg-data-hrv opacity-20" />
            <span className="text-text-medium">Zone normale</span>
          </div>
        </div>
      </div>

      {/* Baseline Info */}
      <div className="mb-4 rounded-lg bg-surface-elevated p-3">
        <p className="text-caption text-text-medium">
          Votre zone normale:{' '}
          <span className="font-mono text-text-highest">
            {data[0]?.baselineMin}-{data[0]?.baselineMax} ms
          </span>
        </p>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#242424"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#6B6B6B"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />

            <YAxis
              stroke="#6B6B6B"
              style={{ fontSize: '12px' }}
              tickLine={false}
              domain={[30, 80]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#2F80ED', strokeWidth: 1, strokeDasharray: '5 5' }}
            />

            {/* Baseline Reference Line */}
            <ReferenceLine
              y={baseline}
              stroke="#00E5FF"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />

            {/* Main Data Line with Gradient */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#hrvGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#00E5FF',
                stroke: '#050505',
                strokeWidth: 2,
              }}
              animationDuration={1200}
              animationEasing="ease-out"
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="hrvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E676" stopOpacity={1} />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity={1} />
                <stop offset="100%" stopColor="#FF3D00" stopOpacity={1} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-lg bg-surface-elevated p-4"
      >
        <h4 className="mb-2 text-body-m font-semibold text-text-highest">
          Analysis
        </h4>
        <p className="text-body-s leading-relaxed text-text-high">
          Your HRV is stable and remains within your normal range. The
          observed variations are physiological and correspond to your
          training rhythm.
        </p>
      </motion.div>
    </motion.div>
  )
}
