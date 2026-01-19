'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import BiomarkerList from '@/components/features/analytics/BiomarkerList'
import CorrelationEngine from '@/components/helix/organisms/CorrelationEngine'
import NormativeChart from '@/components/features/analytics/NormativeChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('biomarkers')

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
          Intelligence
        </h1>
        <p className="mt-1 text-body-m text-text-medium">
          Analysez vos biomarqueurs en profondeur
        </p>
      </motion.header>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="mb-6 w-full bg-surface-card">
          <TabsTrigger value="biomarkers" className="flex-1">
            Biomarqueurs
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex-1">
            Corrélation
          </TabsTrigger>
        </TabsList>

        {/* Tab Content - Biomarkers List */}
        <TabsContent value="biomarkers" className="mt-0 space-y-6">
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

