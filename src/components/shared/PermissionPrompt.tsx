'use client'

import { motion } from 'framer-motion'
import { MapPin, Microphone, Heart, Bell } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type PermissionType = 'location' | 'microphone' | 'health' | 'notifications'

interface PermissionPromptProps {
  type?: PermissionType
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onGrant?: () => void
  onDeny?: () => void
  onGranted?: () => void
}

const permissionConfig = {
  location: {
    icon: MapPin,
    title: 'Allow Access to Your Location',
    description: 'To share your real-time location with your trusted circle during activities.',
    benefit: 'Your safety is our priority',
    color: 'text-brand-electric',
  },
  microphone: {
    icon: Microphone,
    title: 'Allow Access to Microphone',
    description: 'To use voice commands and log your activities without touching the screen.',
    benefit: 'Hands-free app control',
    color: 'text-signal-success',
  },
  health: {
    icon: Heart,
    title: 'Connect Apple Health',
    description: 'To import your biometric data and generate personalized insights.',
    benefit: 'Complete health analysis',
    color: 'text-signal-critical',
  },
  notifications: {
    icon: Bell,
    title: 'Allow Notifications',
    description: 'To receive recovery alerts and personalized training reminders.',
    benefit: "Don't miss any important insights",
    color: 'text-signal-caution',
  },
}

export default function PermissionPrompt({ 
  type = 'location', 
  isOpen, 
  onOpenChange,
  onGrant, 
  onDeny,
  onGranted
}: PermissionPromptProps) {
  const config = permissionConfig[type]
  const Icon = config.icon

  // Determine open state
  const isDialogOpen = isOpen !== undefined ? isOpen : true
  
  const handleGrant = () => {
    onGrant?.()
    onGranted?.()
    onOpenChange?.(false)
  }

  const handleDeny = () => {
    onDeny?.()
    onOpenChange?.(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange || handleDeny}>
      <DialogContent className="max-w-md bg-surface-elevated border-surface-elevated">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-card"
          >
            <Icon size={40} weight="bold" className={config.color} />
          </motion.div>

          {/* Title */}
          <DialogTitle className="mb-3 font-display text-display-s text-text-highest">
            {config.title}
          </DialogTitle>

          {/* Description */}
          <p className="mb-2 text-body-m leading-relaxed text-text-high">
            {config.description}
          </p>

          {/* Benefit */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-brand-electric/20 px-4 py-2">
            <span className="text-body-s font-medium text-brand-electric">
              {config.benefit}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleDeny}
              variant="outline"
              className="flex-1 border-surface-elevated bg-surface-card hover:bg-surface-modal"
            >
              Not Now
            </Button>
            <Button
              onClick={handleGrant}
              className="flex-1 bg-brand-electric hover:bg-brand-deep"
            >
              Allow
            </Button>
          </div>

          {/* Privacy Note */}
          <p className="mt-6 text-caption text-text-low">
            You can change these permissions anytime in settings
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
