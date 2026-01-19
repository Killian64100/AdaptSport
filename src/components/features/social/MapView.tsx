'use client'

import { motion } from 'framer-motion'
import type { PrivacyZone } from './PrivacySettings'

interface MapMarker {
  position: { lat: number; lng: number }
  label: string
  type: 'user' | 'contact'
}

interface MapViewProps {
  center: { lat: number; lng: number }
  markers?: MapMarker[]
  privacyZones?: PrivacyZone[]
  showPrivacyZones?: boolean
}

export default function MapView({ 
  center, 
  markers = [], 
  privacyZones = [],
  showPrivacyZones = false 
}: MapViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-64 overflow-hidden rounded-xl bg-surface-card"
    >
      {/* Simplified map mockup */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-surface-card">
        {/* Grid pattern */}
        <svg className="h-full w-full opacity-10">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Privacy Zones */}
        {showPrivacyZones && privacyZones.map((zone) => (
          <motion.div
            key={zone.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${zone.radius / 2}px`,
              height: `${zone.radius / 2}px`,
            }}
          >
            <div className="h-full w-full rounded-full bg-signal-critical/20 border-2 border-signal-critical/50 blur-sm" />
          </motion.div>
        ))}

        {/* User Markers */}
        {markers.map((marker, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              {/* Ping animation */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -inset-3 rounded-full ${
                  marker.type === 'user' ? 'bg-brand-electric/30' : 'bg-signal-success/30'
                }`}
              />
              {/* Pin */}
              <div className={`relative h-8 w-8 rounded-full shadow-lg ${
                marker.type === 'user' ? 'bg-brand-electric' : 'bg-signal-success'
              }`}>
                <div className="absolute inset-2 rounded-full bg-surface-void" />
              </div>
              {/* Label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-surface-elevated px-2 py-1 text-caption text-text-high">
                {marker.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      {showPrivacyZones && privacyZones.length > 0 && (
        <div className="absolute bottom-3 left-3 rounded-lg bg-surface-elevated/90 backdrop-blur-sm px-3 py-2">
          <div className="flex items-center gap-2 text-caption text-text-medium">
            <div className="h-3 w-3 rounded-full bg-signal-critical" />
            <span>Zones masquées</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
