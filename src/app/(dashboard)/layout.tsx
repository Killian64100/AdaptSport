'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Heartbeat,
  Brain,
  Calendar,
  Users,
  SlidersHorizontal,
  Play,
  Stop,
} from '@phosphor-icons/react'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'

interface TabItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Heartbeat, href: '/dashboard' },
  { id: 'health-data', label: 'Health Data', icon: Brain, href: '/health-data' },
  { id: 'coach', label: 'Personal Coach', icon: Calendar, href: '/coach' },
  { id: 'circle', label: 'The Circle', icon: Users, href: '/circle' },
  { id: 'system', label: 'System', icon: SlidersHorizontal, href: '/system' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isSimulating, startDemoMode, stopDemoMode } = useBiomarkerStore()

  const toggleDemoMode = () => {
    if (isSimulating) {
      stopDemoMode()
    } else {
      startDemoMode()
    }
  }

  const currentTab =
    tabs.find(tab => pathname.startsWith(`/dashboard${tab.href}`))?.id ||
    tabs.find(tab => pathname.startsWith(tab.href))?.id ||
    'dashboard'

  return (
    <div className="relative flex min-h-screen flex-col bg-surface-void">
      {/* Demo Mode Indicator */}
      {isSimulating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full bg-brand-electric/20 backdrop-blur-md border border-brand-electric px-4 py-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-brand-electric"
          />
          <span className="text-body-s font-medium text-brand-electric">Simulation active</span>
        </motion.div>
      )}

      {/* Demo Toggle Button - Fixed Top Right */}
      <motion.button
        onClick={toggleDemoMode}
        whileTap={{ scale: 0.95 }}
        className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-body-s transition-all shadow-lg ${
          isSimulating
            ? 'bg-brand-electric text-white shadow-brand-electric/50'
            : 'bg-surface-elevated text-text-medium hover:bg-surface-modal hover:text-text-high'
        }`}
      >
        {isSimulating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Stop size={16} weight="fill" />
            </motion.div>
            <span>Arrêter</span>
          </>
        ) : (
          <>
            <Play size={16} weight="fill" />
            <span>Demo Mode</span>
          </>
        )}
      </motion.button>
      
      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-card bg-surface-global/95 backdrop-blur-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
          {tabs.map(tab => {
            const isActive = currentTab === tab.id
            const Icon = tab.icon

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 transition-colors rounded-md ${
                  isActive ? 'bg-brand-electric/10' : ''
                }`}
              >
                {/* Active Indicator - Top bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 inset-x-0 h-1 bg-brand-electric"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Icon - Flex centered */}
                <div className="flex items-center justify-center h-6 w-6 relative z-10">
                  <Icon
                    weight={isActive ? 'fill' : 'regular'}
                    size={24}
                    className={isActive ? 'text-brand-electric' : 'text-text-medium'}
                  />
                </div>

                {/* Label - Centered with fixed line height */}
                <span
                  className={`text-[10px] font-medium leading-tight whitespace-nowrap relative z-10 ${
                    isActive ? 'text-brand-electric' : 'text-text-low'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
