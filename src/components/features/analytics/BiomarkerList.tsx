'use client'

import { motion } from 'framer-motion'
import BiomarkerCard from './BiomarkerCard'
import { Heart, Pulse, Moon, Drop, Wind, Fire, Lightning } from '@phosphor-icons/react'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'

// Type définitions
export interface Biomarker {
  id: string
  name: string
  value: number
  unit: string
  icon: React.ElementType
  status: 'normal' | 'attention' | 'alert'
  trend: number[] // 7 derniers jours
  baseline?: { min: number; max: number }
}

export default function BiomarkerList() {
  // Récupération des données réelles depuis le store
  const { hrv, rhr, sleep, spo2, strain } = useBiomarkerStore()
  
  // Données avec valeurs du store
  const mockBiomarkers: Biomarker[] = [
    {
      id: 'hrv',
      name: 'HRV',
      value: hrv,
      unit: 'ms',
      icon: Heart,
      status: hrv >= 55 ? 'normal' : 'attention',
      trend: [52, 54, 56, 55, 57, 59, hrv],
      baseline: { min: 45, max: 65 },
    },
    {
      id: 'rhr',
      name: 'RHR',
      value: rhr,
      unit: 'bpm',
      icon: Pulse,
      status: rhr <= 60 ? 'normal' : 'attention',
      trend: [54, 53, 55, 52, 51, 53, rhr],
    },
    {
      id: 'sleep',
      name: 'Sleep',
      value: sleep,
      unit: 'h',
      icon: Moon,
      status: sleep >= 7 ? 'normal' : 'attention',
      trend: [6.8, 7.2, 7.0, 7.5, 7.3, 7.8, sleep],
    },
    {
      id: 'spo2',
      name: 'SpO₂',
      value: spo2,
      unit: '%',
      icon: Wind,
      status: spo2 >= 95 ? 'normal' : 'attention',
      trend: [96, 97, 96, 98, 97, 97, spo2],
    },
    {
      id: 'strain',
      name: 'Strain',
      value: strain,
      unit: '/21',
      icon: Fire,
      status: strain > 15 ? 'attention' : 'normal',
      trend: [8.5, 9.1, 10.0, 11.2, 9.8, 10.5, strain],
    },
  ]
  return (
    <div className="space-y-3">
      {mockBiomarkers.map((biomarker, index) => (
        <motion.div
          key={biomarker.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.08,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <BiomarkerCard biomarker={biomarker} />
        </motion.div>
      ))}
    </div>
  )
}
