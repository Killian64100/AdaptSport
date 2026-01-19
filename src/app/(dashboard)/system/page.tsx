'use client'

import { motion } from 'framer-motion'

export default function SystemPage() {
  return (
    <div className="min-h-screen pb-24 bg-surface-void">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="animate-slide-up px-4 pb-6 pt-12"
      >
        <h1 className="font-display text-3xl font-bold text-text-highest">
          System
        </h1>
        <p className="mt-1 text-text-medium">
          Settings and connected devices
        </p>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 space-y-4">
        {/* Connected devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="animate-slide-up rounded-xl bg-surface-card p-6"
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-text-highest">
            Connected devices
          </h3>
          <div className="space-y-3">
            {['Apple Watch Series 9', 'Oura Ring Gen 3', 'Whoop 4.0'].map((device, idx) => (
              <motion.div
                key={device}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (idx + 1) * 0.1 }}
                className="flex items-center justify-between rounded-lg bg-surface-elevated p-4"
              >
                <div>
                  <p className="font-medium text-text-highest">{device}</p>
                  <p className="text-xs text-text-medium">Connecté</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-signal-success"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Préférences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="animate-slide-up rounded-xl bg-surface-card p-6"
          style={{ animationDelay: '0.1s' }}
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-text-highest">
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-high">Dark mode</span>
              <span className="text-sm text-signal-success">Always active</span>
            </div>
            <div className="flex items-center justify-between border-t border-surface-elevated pt-4">
              <span className="text-text-high">Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-electric transition-colors">
                <span className="inline-block h-5 w-5 translate-x-5 transform rounded-full bg-surface-void shadow-lg"></span>
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-surface-elevated pt-4">
              <span className="text-text-high">Adaptive mode</span>
              <span className="text-sm text-brand-electric">Morning</span>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="animate-slide-up w-full rounded-xl bg-brand-electric p-4 text-center font-semibold text-surface-void hover:bg-brand-deep transition-colors"
          style={{ animationDelay: '0.2s' }}
        >
          Log out
        </motion.button>
      </div>
    </div>
  )
}
