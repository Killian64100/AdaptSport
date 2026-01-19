'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import BiomarkerList from '@/components/features/analytics/BiomarkerList'
import RecoveryHistoryCard from '@/components/features/analytics/RecoveryHistoryCard'
import CorrelationEngine from '@/components/helix/organisms/CorrelationEngine'
import NormativeChart from '@/components/features/analytics/NormativeChart'
import CircularMetricGauge from '@/components/features/dashboard/CircularMetricGauge'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import { Heartbeat, Lightning } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HealthDataPage() {
  const [activeTab, setActiveTab] = useState('biomarkers')
  const { recovery, calories } = useBiomarkerStore()

  return (
    <div className="min-h-screen bg-surface-void pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="animate-slide-up px-4 pb-6 pt-12"
        style={{ paddingTop: 'max(3rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-display-s text-text-highest">
          Health Data
        </h1>
        <p className="mt-1 text-body-m text-text-medium">
          Analyze your biomarkers in depth
        </p>
      </motion.header>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="mb-6 w-full bg-surface-card">
          <TabsTrigger value="biomarkers" className="flex-1">
            Biomarkers
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex-1">
            Correlation
          </TabsTrigger>
        </TabsList>

        {/* Tab Content - Biomarkers List */}
        <TabsContent value="biomarkers" className="mt-0 space-y-6">
          {/* Top Section: Two Circular Gauges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Recovery Circle */}
            <CircularMetricGauge
              metricId="recovery"
              value={recovery}
              label="Recovery"
              unit="%"
              color="#FFC400"
              icon={Heartbeat}
              size="large"
            />

            {/* Calories Circle */}
            <CircularMetricGauge
              metricId="calories"
              value={calories}
              label="Calories"
              unit="kcal"
              color="#00E5FF"
              icon={Lightning}
              size="large"
            />
          </motion.div>

          <BiomarkerList />
          
          {/* Normative Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <NormativeChart />
          </motion.div>
        </TabsContent>

        {/* Tab Content - Correlation Engine */}
        <TabsContent value="correlation" className="mt-0">
          <CorrelationEngine />
        </TabsContent>
      </Tabs>
    </div>
  )
}

