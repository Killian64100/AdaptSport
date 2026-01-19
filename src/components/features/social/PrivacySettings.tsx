'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Trash, Eye, EyeSlash } from '@phosphor-icons/react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import PrivacyZoneEditor from './PrivacyZoneEditor'

// Dynamic import to avoid SSR hydration
const InteractiveMap = dynamic(() => import('./InteractiveMap'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-2xl bg-surface-elevated">
      <div className="text-text-medium">Loading map...</div>
    </div>
  ),
})

export interface PrivacyZone {
  id: string
  name: string
  radius: number
  coordinates: { lat: number; lng: number }
  createdAt: Date
}

const mockZones: PrivacyZone[] = [
  {
    id: '1',
    name: 'Domicile',
    radius: 300,
    coordinates: { lat: 47.4780, lng: -0.5640 }, // Proche d'Angers
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Bureau',
    radius: 200,
    coordinates: { lat: 47.4788, lng: -0.5625 }, // Proche d'Angers
    createdAt: new Date('2024-01-05'),
  },
]

export default function PrivacySettings() {
  const [zones, setZones] = useState<PrivacyZone[]>(mockZones)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<PrivacyZone | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleAddZone = () => {
    setEditingZone(null)
    setEditorOpen(true)
  }

  const handleEditZone = (zone: PrivacyZone) => {
    setEditingZone(zone)
    setEditorOpen(true)
  }

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter((z) => z.id !== id))
  }

  const handleSaveZone = (zoneData: Omit<PrivacyZone, 'id' | 'createdAt'>) => {
    if (editingZone) {
      // Update existing
      setZones(zones.map((z) =>
        z.id === editingZone.id ? { ...z, ...zoneData } : z
      ))
    } else {
      // Add new
      const newZone: PrivacyZone = {
        id: Date.now().toString(),
        ...zoneData,
        createdAt: new Date(),
      }
      setZones([...zones, newZone])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={24} weight="fill" className="text-brand-electric" />
          <h2 className="text-title-lg font-bold text-text-high">Zones de Confidentialité</h2>
        </div>
        <Button
          onClick={handleAddZone}
          className="gap-2 bg-brand-electric hover:bg-brand-electric/90 text-surface-void"
        >
          <Plus size={18} weight="bold" />
          Nouvelle zone
        </Button>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-signal-caution/10 p-4 border border-signal-caution/20"
      >
        <p className="text-body-xs text-text-medium">
          🔒 Zones automatically hide your position from your contacts and the anonymous leaderboard
        </p>
      </motion.div>

      {/* Map Preview Toggle */}
      {zones.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 rounded-lg bg-surface-elevated px-3 py-2 text-body-xs font-semibold text-brand-electric hover:bg-surface-elevated/80 transition-colors"
          >
            {showPreview ? (
              <>
                <Eye size={16} weight="fill" />
                Hide map
              </>
            ) : (
              <>
                <EyeSlash size={16} weight="fill" />
                Voir la carte
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Map View */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InteractiveMap
              privacyZones={zones}
              showPrivacyZones={true}
              markers={[]}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zones List */}
      <div className="space-y-2">
        <AnimatePresence>
          {zones.length > 0 ? (
            zones.map((zone) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group relative rounded-lg border border-surface-border bg-surface-card p-4 hover:border-brand-electric/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-electric/20 flex items-center justify-center">
                      <MapPin size={20} weight="fill" className="text-brand-electric" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-high text-body-xs">
                        {zone.name}
                      </h3>
                      <p className="text-caption text-text-secondary">
                        Rayon: {zone.radius}m
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ brightness: 1.1 }}
                      whileTap={{ opacity: 0.8 }}
                      onClick={() => handleEditZone(zone)}
                      className="rounded-lg bg-surface-elevated hover:bg-brand-electric/10 p-2 text-body-xs text-brand-electric"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ brightness: 1.1 }}
                      whileTap={{ opacity: 0.8 }}
                      onClick={() => handleDeleteZone(zone.id)}
                      className="rounded-lg bg-surface-elevated hover:bg-signal-critical/10 p-2 text-signal-critical"
                    >
                      <Trash size={16} weight="bold" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-surface-border bg-surface-elevated/50 p-8 text-center"
            >
              <MapPin size={48} className="mx-auto mb-4 text-text-tertiary" />
              <h3 className="mb-2 font-bold text-text-high">No Zones Created</h3>
              <p className="text-body-xs text-text-secondary mb-4">
                Create zones to automatically hide certain locations
              </p>
              <Button
                onClick={handleAddZone}
                className="gap-2 bg-brand-electric hover:bg-brand-electric/90 text-surface-void"
              >
                <Plus size={16} weight="bold" />
                Create Zone
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor Modal */}
      <PrivacyZoneEditor
        zone={editingZone}
        isOpen={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveZone}
      />
    </motion.div>
  )
}
