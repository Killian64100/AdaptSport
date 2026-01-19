'use client'

import { motion } from 'framer-motion'
import { X, MapPin } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'

interface PrivacyZone {
  id: string
  name: string
  radius: number
  coordinates: { lat: number; lng: number }
  createdAt: Date
}

interface PrivacyZoneEditorProps {
  zone?: PrivacyZone | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (zone: Omit<PrivacyZone, 'id' | 'createdAt'>) => void
}

export default function PrivacyZoneEditor({
  zone,
  isOpen,
  onOpenChange,
  onSave,
}: PrivacyZoneEditorProps) {
  const [name, setName] = useState(zone?.name || '')
  const [radius, setRadius] = useState(zone?.radius || 100)
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!name.trim()) {
      setError('Zone name is required')
      return
    }

    if (radius < 50 || radius > 1000) {
      setError('Le rayon doit être entre 50 et 1000 mètres')
      return
    }

    onSave({
      name,
      radius,
      coordinates: zone?.coordinates || { lat: 0, lng: 0 },
    })

    // Reset
    setName('')
    setRadius(100)
    setError('')
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName(zone?.name || '')
      setRadius(zone?.radius || 100)
      setError('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin size={20} weight="fill" className="text-brand-electric" />
            {zone ? 'Edit Zone' : 'Create Privacy Zone'}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Zone Name Input */}
          <div>
            <label className="block text-body-xs font-semibold text-text-high mb-2">
              Zone Name
            </label>
            <input
              type="text"
              placeholder="ex: Bureau, Domicile, Salle de gym..."
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className="w-full rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-body-xs placeholder:text-text-secondary focus:border-brand-electric focus:outline-none focus:ring-2 focus:ring-brand-electric/20"
            />
          </div>

          {/* Radius Slider */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-body-xs font-semibold text-text-high">
                Rayon de masquage
              </label>
              <motion.span
                key={radius}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-lg bg-brand-electric/10 px-2 py-1 text-body-xs font-bold text-brand-electric"
              >
                {radius} m
              </motion.span>
            </div>

            <Slider
              value={[radius]}
              onValueChange={(value) => setRadius(value[0])}
              min={50}
              max={1000}
              step={10}
              className="w-full"
            />

            <div className="mt-2 grid grid-cols-3 text-center text-caption text-text-secondary">
              <div>50 m</div>
              <div>525 m</div>
              <div>1000 m</div>
            </div>
          </div>

          {/* Zone Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-surface-elevated p-4"
          >
            <div className="mb-2 text-body-xs font-semibold text-text-medium">
              Aperçu de la zone
            </div>
            <div className="relative h-48 w-full rounded-lg bg-gradient-to-br from-surface-card to-surface-elevated overflow-hidden">
              {/* Center marker */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative h-32 w-32"
                >
                  {/* Zone circle */}
                  <div
                    className="absolute inset-0 rounded-full bg-signal-critical/10 border-2 border-signal-critical/30 blur-sm"
                    style={{
                      transform: `scale(${Math.max(radius / 500, 0.3)})`,
                    }}
                  />
                  {/* Center point */}
                  <div className="absolute inset-1/3 rounded-full bg-brand-electric shadow-lg" />
                </motion.div>
              </div>

              {/* Grid background */}
              <svg className="absolute inset-0 h-full w-full opacity-5">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </motion.div>

          {/* Info message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-signal-caution/10 p-3 border border-signal-caution/20"
          >
            <p className="text-caption text-text-medium">
              📍 Tous les points dans cette zone seront masqués de votre localisation avec un décalage aléatoire de ±20%
            </p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-signal-critical/10 p-3 border border-signal-critical/20"
            >
              <p className="text-caption text-signal-critical">{error}</p>
            </motion.div>
          )}
        </motion.div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-brand-electric hover:bg-brand-deep"
          >
            Save Zone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
