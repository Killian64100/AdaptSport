'use client'

import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LocationBeacon from '@/components/features/social/LocationBeacon'
import ChallengesList from '@/components/features/social/ChallengesList'

export default function CirclePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-24 bg-surface-void"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="animate-slide-up px-4 pb-6 pt-12"
      >
        <h1 className="font-display text-3xl font-bold text-text-highest">
          The Circle
        </h1>
        <p className="mt-1 text-text-medium">
          Connect securely and anonymously
        </p>
      </motion.header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4"
      >
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="beacon" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 bg-surface-elevated p-1">
              <TabsTrigger
                value="beacon"
                className="data-[state=active]:bg-brand-electric/20 data-[state=active]:text-brand-electric"
              >
                📍 Beacon
              </TabsTrigger>
              <TabsTrigger
                value="challenges"
                className="data-[state=active]:bg-brand-electric/20 data-[state=active]:text-brand-electric"
              >
                🏆 Challenges
              </TabsTrigger>
            </TabsList>

            {/* Beacon Tab */}
            <TabsContent
              value="beacon"
              className="mt-6 space-y-6 animate-in fade-in-50 duration-300"
            >
              <LocationBeacon />
            </TabsContent>

            {/* Challenges Tab */}
            <TabsContent
              value="challenges"
              className="mt-6 space-y-6 animate-in fade-in-50 duration-300"
            >
              <ChallengesList />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  )
}
