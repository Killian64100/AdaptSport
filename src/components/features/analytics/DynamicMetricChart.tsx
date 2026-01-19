'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import mockData from '@/data/mock-health.json'

// Convertit un nombre décimal (ex: 7.5) en chaîne horaire (ex: "7h30")
const decimalToTime = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours)
  const minutes = Math.round((decimalHours - hours) * 60)
  // Gère le cas où l'arrondi donne 60 minutes
  if (minutes === 60) return `${hours + 1}h00`
  // Ajoute un zéro devant les minutes si nécessaire (ex: 7h05)
  return `${hours}h${minutes.toString().padStart(2, '0')}`
}

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

// Custom Tooltip
const CustomTooltip = ({ active, payload, metricUnit, isSleep }: any) => {
  if (!active || !payload || !payload[0]) return null

  const data = payload[0].payload

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg bg-surface-elevated p-3 shadow-glow-md"
    >
      <p className="mb-1 text-caption text-text-medium">{data.date}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-mono-l text-text-highest">
          {isSleep ? decimalToTime(data.value) : data.value}
        </span>
        <span className="text-caption text-text-medium">{metricUnit}</span>
      </div>
    </motion.div>
  )
}

interface DynamicMetricChartProps {
  metricId?: string
}

// Mapping des noms de métriques entre le code et le JSON
const metricMapping: Record<string, keyof typeof mockData.history[0]> = {
  hrv: 'hrv',
  rhr: 'rhr',
  sleep: 'sleep',
  spo2: 'spo2',
  strain: 'strain',
  recovery: 'recovery',
  calories: 'calories',
}

export default function DynamicMetricChart({ metricId }: DynamicMetricChartProps) {
  const selectedMetricId = useBiomarkerStore((state) => state.selectedMetricId)
  const currentMetricId = metricId || selectedMetricId
  
  // Récupérer les données historiques depuis le JSON (7 jours)
  const historyKey = metricMapping[currentMetricId] || 'hrv'
  const chartData = (mockData.history || []).map((day) => {
    const rawValue = day[historyKey]
    // Convertir les valeurs de sommeil (string "7h30") en décimal (7.5)
    const value = currentMetricId === 'sleep' ? timeToDecimal(rawValue as any) : (rawValue as number)
    
    return {
      date: day.date,
      value: value,
    }
  })
  
  // Metric metadata
  const metricInfo = {
    hrv: { name: 'HRV', unit: 'ms' },
    rhr: { name: 'RHR', unit: 'bpm' },
    sleep: { name: 'Sleep', unit: 'h' },
    spo2: { name: 'SpO2', unit: '%' },
    strain: { name: 'Strain', unit: '/21' },
    recovery: { name: 'Recovery', unit: '%' },
    calories: { name: 'Calories', unit: 'kcal' },
  }[currentMetricId] || { name: 'HRV', unit: 'ms' }

  // Calculer la baseline (moyenne sur les 7 jours)
  const baseline = chartData.reduce((sum, day) => sum + day.value, 0) / chartData.length

  // Couleurs selon la métrique
  const metricColors: Record<string, string> = {
    hrv: '#00E5FF',
    rhr: '#FF6E40',
    sleep: '#7C4DFF',
    spo2: '#00E676',
    glucose: '#FFC400',
    strain: '#FF3D00',
  }

  const lineColor = metricColors[currentMetricId] || '#00E5FF'
  const isSleep = currentMetricId === 'sleep'

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
          Trend {metricInfo.name}
        </h3>
        <div className="flex items-center gap-4 text-caption">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4" style={{ backgroundColor: lineColor }} />
            <span className="text-text-medium">Current Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-text-low opacity-40" />
            <span className="text-text-medium">Average</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
            <XAxis
              dataKey="date"
              stroke="#6B6B6B"
              tick={{ fill: '#A0A0A0', fontSize: 12 }}
              label={{ value: 'Dates (January 2026)', position: 'insideBottom', offset: -5, fill: '#6B6B6B' }}
            />
            <YAxis
              stroke="#6B6B6B"
              tick={{ fill: '#A0A0A0', fontSize: 12 }}
              label={{ value: metricInfo.unit, angle: -90, position: 'insideLeft', fill: '#6B6B6B' }}
              tickFormatter={isSleep ? decimalToTime : undefined}
            />
            <Tooltip content={<CustomTooltip metricUnit={metricInfo.unit} isSleep={isSleep} />} />
            
            {/* Baseline (moyenne) - ligne horizontale */}
            <ReferenceLine
              y={baseline}
              stroke="#6B6B6B"
              strokeDasharray="5 5"
              strokeWidth={2}
              strokeOpacity={0.7}
              label={{
                value: `Avg: ${isSleep ? decimalToTime(baseline) : baseline.toFixed(1)}`,
                position: 'right',
                fill: '#A0A0A0',
                fontSize: 12,
              }}
            />

            {/* Line principale */}
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6, fill: lineColor }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
