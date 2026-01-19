'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RadioButton, SignOut, Users, Clock } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { generateGeometricAvatar } from '@/lib/avatarGenerator'
import PermissionPrompt from '@/components/shared/PermissionPrompt'

// Import dynamique pour éviter l'hydratation SSR
const InteractiveMap = dynamic(() => import('./InteractiveMap'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-2xl bg-surface-elevated">
      <div className="text-text-medium">Chargement de la carte...</div>
    </div>
  ),
})

interface Contact {
  id: string
  name: string
  pseudonym: string
  avatar: string
  status: 'online' | 'offline'
  beaconActive: boolean
  location?: { lat: number; lng: number }
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice M.',
    pseudonym: 'PhoenixX',
    avatar: 'PhoenixX',
    status: 'online',
    beaconActive: true,
    location: { lat: 47.4790, lng: -0.5620 }, // ~500m au nord-est d'Angers
  },
  {
    id: '2',
    name: 'Bob D.',
    pseudonym: 'AthleteBlue',
    avatar: 'AthleteBlue',
    status: 'online',
    beaconActive: false,
  },
  {
    id: '3',
    name: 'Carol L.',
    pseudonym: 'VortexMind',
    avatar: 'VortexMind',
    status: 'offline',
    beaconActive: false,
  },
  {
    id: '4',
    name: 'David K.',
    pseudonym: 'NexusWave',
    avatar: 'NexusWave',
    status: 'online',
    beaconActive: true,
    location: { lat: 47.4770, lng: -0.5650 }, // ~500m au sud-ouest d'Angers
  },
  {
    id: '5',
    name: 'Emma R.',
    pseudonym: 'ZenithCore',
    avatar: 'ZenithCore',
    status: 'online',
    beaconActive: false,
  },
]

export default function LocationBeacon() {
  const [isBeaconActive, setIsBeaconActive] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(14400) // 4 hours in seconds
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)
  const [beaconStartTime, setBeaconStartTime] = useState<Date | null>(null)
  const [selectedContactOnMap, setSelectedContactOnMap] = useState<Contact | null>(null)
  const [showMap, setShowMap] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!isBeaconActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsBeaconActive(false)
          setSelectedContacts([])
          return 14400
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isBeaconActive])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours}h ${minutes}m ${secs}s`
  }

  const handleBeaconToggle = () => {
    if (!isBeaconActive) {
      setShowPermissionPrompt(true)
    } else {
      setIsBeaconActive(false)
      setSelectedContacts([])
      setTimeLeft(14400)
      setBeaconStartTime(null)
    }
  }

  const handlePermissionGranted = () => {
    setIsBeaconActive(true)
    setBeaconStartTime(new Date())
    setShowPermissionPrompt(false)
  }

  const handleContactToggle = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId))
    } else if (selectedContacts.length < 5) {
      setSelectedContacts([...selectedContacts, contactId])
    }
  }

  const handleContactClick = (contact: Contact) => {
    if (contact.beaconActive && contact.location) {
      setSelectedContactOnMap(contact)
      setShowMap(true)
      // Scroll vers la section carte si elle existe
      setTimeout(() => {
        document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with beacon status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            {isBeaconActive && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-signal-success/30"
              />
            )}
            <div
              className={`relative h-full w-full rounded-full flex items-center justify-center transition-colors ${
                isBeaconActive
                  ? 'bg-signal-success text-surface-void'
                  : 'bg-surface-elevated text-text-secondary'
              }`}
            >
              <RadioButton size={24} weight="fill" />
            </div>
          </div>
          <div>
            <h2 className="text-title-lg font-bold text-text-high">Solo Activity Protection</h2>
            <p className="text-body-xs text-text-secondary">
              {isBeaconActive ? 'Active protection' : 'Inactive protection'}
            </p>
          </div>
        </div>
      </div>

      {/* Safety notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-signal-caution/10 p-4 border border-signal-caution/20"
      >
        <p className="text-body-xs text-text-medium">
          🛡️ <strong>Solo Safety:</strong> Share your location with trusted contacts during solo activities.
        </p>
      </motion.div>

      {/* Active beacon info */}
      <AnimatePresence>
        {isBeaconActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-lg bg-signal-success/10 p-4 border border-signal-success/30"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-body-xs font-semibold text-signal-success">
                Active Protection
              </span>
              <span className="text-caption text-text-secondary">
                Since: {beaconStartTime?.toLocaleTimeString('en-US')}
              </span>
            </div>

            {/* Timer */}
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-title-sm font-bold text-signal-success"
            >
              {formatTime(timeLeft)}
            </motion.div>

            <p className="text-caption text-text-secondary mt-2">
              {selectedContacts.length} {selectedContacts.length === 1 ? 'contact' : 'contacts'} alerted. Auto-stop in 4h.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Protection Toggle Button */}
      <motion.button
        whileHover={{ brightness: 1.1 }}
        whileTap={{ opacity: 0.85 }}
        onClick={handleBeaconToggle}
        className={`w-full rounded-lg px-4 py-3 font-semibold text-button-md transition-colors ${
          isBeaconActive
            ? 'bg-signal-critical/20 hover:bg-signal-critical/30 text-signal-critical border border-signal-critical/30'
            : 'bg-signal-success/20 hover:bg-signal-success/30 text-signal-success border border-signal-success/30'
        }`}
      >
        {isBeaconActive ? (
          <>
            <SignOut size={18} className="mr-2 inline" weight="bold" />
            Stop protection
          </>
        ) : (
          <>
            <RadioButton size={18} className="mr-2 inline" weight="fill" />
            Activate Protection
          </>
        )}
      </motion.button>

      {/* Trust circle section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} weight="fill" className="text-brand-electric" />
            <h3 className="text-title-sm font-bold text-text-high">
              Circle of Trust ({selectedContacts.length}/5)
            </h3>
          </div>
        </div>

        {/* Contact selection list */}
        <div className="space-y-2">
          <AnimatePresence>
            {mockContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => handleContactToggle(contact.id)}
                className={`group relative cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedContacts.includes(contact.id)
                    ? 'border-brand-electric bg-brand-electric/10'
                    : 'border-surface-border bg-surface-card hover:border-brand-electric/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-elevated">
                      {generateGeometricAvatar(contact.pseudonym)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-body-xs text-text-high">
                        {contact.name}
                      </div>
                      <div className="flex items-center gap-1 text-caption text-text-secondary">
                        <span>@{contact.pseudonym}</span>
                        {contact.beaconActive && (
                          <motion.span
                            animate={{
                              boxShadow: [
                                '0 0 0 0 rgba(0, 230, 118, 0.7)',
                                '0 0 0 4px rgba(0, 230, 118, 0)',
                              ],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="ml-1 h-2.5 w-2.5 rounded-full bg-signal-success"
                          />
                        )}
                        {!contact.beaconActive && (
                          <span
                            className={`ml-1 h-2 w-2 rounded-full ${
                              contact.status === 'online'
                                ? 'bg-signal-success/50'
                                : 'bg-text-tertiary'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bouton pour voir sur la carte si balise active */}
                  {contact.beaconActive && contact.location && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleContactClick(contact)
                      }}
                      className="mr-2 rounded-lg bg-brand-electric/20 px-3 py-1 text-caption text-brand-electric hover:bg-brand-electric/30 transition-colors"
                    >
                      🗺️ View
                    </button>
                  )}

                  {/* Checkbox */}
                  <motion.div
                    animate={{
                      scale: selectedContacts.includes(contact.id) ? 1 : 0.8,
                    }}
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedContacts.includes(contact.id)
                        ? 'bg-brand-electric border-brand-electric'
                        : 'border-surface-border group-hover:border-brand-electric'
                    }`}
                  >
                    {selectedContacts.includes(contact.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2 w-2 rounded-full bg-surface-void"
                      />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {selectedContacts.length === 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-caption text-signal-caution"
          >
            Limite de 5 contacts atteinte
          </motion.p>
        )}
      </div>

      {/* Interactive Map Section */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-title-sm font-bold text-text-high">
                Real-Time Tracking Map
              </h3>
              <button
                onClick={() => {
                  setShowMap(false)
                  setSelectedContactOnMap(null)
                }}
                className="rounded-lg bg-surface-elevated px-3 py-1.5 text-caption text-text-medium hover:bg-surface-elevated/80 transition-colors"
              >
                Hide
              </button>
            </div>

            <InteractiveMap
              markers={mockContacts
                .filter(c => c.beaconActive && c.location)
                .map(c => ({
                  position: c.location!,
                  label: c.name,
                  type: 'contact' as const,
                  avatar: c.pseudonym,
                }))}
              selectedContact={selectedContactOnMap ? {
                name: selectedContactOnMap.name,
                avatar: selectedContactOnMap.pseudonym,
                position: selectedContactOnMap.location!,
              } : null}
              showPrivacyZones={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission Prompt */}
      <PermissionPrompt
        isOpen={showPermissionPrompt}
        onOpenChange={setShowPermissionPrompt}
        onGranted={handlePermissionGranted}
      />
    </motion.div>
  )
}
