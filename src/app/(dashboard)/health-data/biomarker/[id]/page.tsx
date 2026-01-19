'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, TrendUp } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import DynamicMetricChart from '@/components/features/analytics/DynamicMetricChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import mockData from '@/data/mock-health.json'

// Convertit une chaîne horaire (ex: "7h30") en nombre décimal (ex: 7.5)
const timeToDecimal = (timeString: string | number): number => {
  if (typeof timeString === 'number') return timeString
  const match = timeString.match(/(\d+)h(\d+)?/)
  if (!match) return 0
  const hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  return hours + minutes / 60
}

// Convertit un nombre décimal (ex: 7.5) en chaîne horaire (ex: "7h30")
const decimalToTime = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours)
  const minutes = Math.round((decimalHours - hours) * 60)
  if (minutes === 60) return `${hours + 1}h00`
  return `${hours}h${minutes.toString().padStart(2, '0')}`
}

export default function BiomarkerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params)
  
  // Récupération des données dynamiques depuis le store
  const selectedMetricId = useBiomarkerStore((state) => state.selectedMetricId)
  const hrv = useBiomarkerStore((state) => state.hrv)
  const rhr = useBiomarkerStore((state) => state.rhr)
  const sleep = useBiomarkerStore((state) => state.sleep)
  const spo2 = useBiomarkerStore((state) => state.spo2)
  const strain = useBiomarkerStore((state) => state.strain)
  const recovery = useBiomarkerStore((state) => state.recovery)
  const calories = useBiomarkerStore((state) => state.calories)

  // Utiliser l'id de l'URL ou le selectedMetricId du store
  const metricId = id || selectedMetricId
  
  // Map des valeurs
  const storeValues: Record<string, number> = {
    hrv,
    rhr,
    sleep,
    spo2,
    strain,
    recovery,
    calories,
  }
  
  // Récupérer les données de la métrique depuis le JSON
  const metricInfo = mockData.metrics[metricId as keyof typeof mockData.metrics] || mockData.metrics.hrv
  const currentValue = storeValues[metricId] || hrv
  
  // Utiliser history au lieu de trends (qui n'existe plus)
  const historyData = mockData.history || []
  const trendData = historyData.map(day => {
    const rawValue = day[metricId as keyof typeof day]
    // Convertir les valeurs de sommeil (string "7h30") en décimal (7.5) pour le graphique
    return metricId === 'sleep' ? timeToDecimal(rawValue as any) : (rawValue as number)
  })

  const biomarker = {
    name: metricInfo.name,
    currentValue: currentValue,
    unit: metricInfo.unit,
    status: 'optimal',
    insights: metricInfo.insights,
    trend: trendData,
    isSleep: metricId === 'sleep',
  }

  return (
    <div className="min-h-screen bg-surface-void pb-8">
      {/* Breadcrumb Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pb-4 pt-12"
        style={{ paddingTop: 'max(3rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-body-m text-brand-electric transition-colors hover:text-data-hrv"
        >
          <ArrowLeft size={20} weight="bold" />
          Health Data
        </button>

        <div className="mb-2 flex items-center gap-2 text-caption text-text-medium">
          <span>Health Data</span>
          <span>›</span>
          <span className="text-text-high">{biomarker.name}</span>
        </div>

        <h1 className="font-display text-display-s text-text-highest">
          {biomarker.name}
        </h1>

        {/* Current Value Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 rounded-xl bg-surface-card p-4"
        >
          <p className="mb-1 text-caption text-text-medium">Current Value</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-display-m text-text-highest">
              {isNaN(biomarker.currentValue) || biomarker.currentValue === null 
                ? 'Loading...' 
                : biomarker.isSleep 
                  ? decimalToTime(biomarker.currentValue)
                  : biomarker.currentValue}
            </span>
            {!biomarker.isSleep && (
              <span className="text-body-l text-text-medium">{biomarker.unit}</span>
            )}
            <TrendUp size={24} weight="bold" className="ml-2 text-signal-success" />
          </div>
        </motion.div>
      </motion.header>

      {/* Tabs: Overview / Raw Data */}
      <div className="px-4">
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="w-full bg-surface-card">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex-1">
              Raw Data
            </TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Chart Dynamique */}
            <DynamicMetricChart metricId={metricId} />

            {/* Insights List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-surface-card p-6"
            >
              <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
                Key Insights
              </h3>
              <ul className="space-y-3">
                {biomarker.insights.map((insight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-electric" />
                    <span className="text-body-m text-text-high">{insight}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </TabsContent>

          {/* Tab: Raw Data */}
          <TabsContent value="raw" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-surface-card p-6"
            >
              <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
                Last 7 Days History
              </h3>
              <div className="space-y-2">
                {[...biomarker.trend].reverse().map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-surface-elevated py-3 last:border-0"
                  >
                    <span className="text-body-m text-text-medium">
                      Day {7 - index}
                    </span>
                    <span className="font-mono text-mono-m text-text-highest">
                      {biomarker.isSleep ? decimalToTime(value) : `${value} ${biomarker.unit}`}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
