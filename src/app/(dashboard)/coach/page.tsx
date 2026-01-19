'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AIChat from '@/components/features/coach/AIChat'
import ProtocolLibrary from '@/components/features/coach/ProtocolLibrary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CoachPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('coach')

  // Détecter le paramètre tab dans l'URL
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'library') {
      setActiveTab('library')
    }
  }, [searchParams])

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
          Personal Coach
        </h1>
        <p className="mt-1 text-body-m text-text-medium">
          AI Coaching and bio-hacking protocols
        </p>
      </motion.header>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="px-4"
        suppressHydrationWarning
      >
        <TabsList className="mb-6 w-full bg-surface-card" suppressHydrationWarning>
          <TabsTrigger value="coach" className="flex-1" suppressHydrationWarning>
            AI Coach
          </TabsTrigger>
          <TabsTrigger value="library" className="flex-1" suppressHydrationWarning>
            Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coach" className="mt-0" suppressHydrationWarning>
          <AIChat />
        </TabsContent>

        <TabsContent value="library" className="mt-0" suppressHydrationWarning>
          <ProtocolLibrary />
        </TabsContent>
      </Tabs>
    </div>
  )
}
