'use client'

import { useState } from 'react'

export type ContextMode = 'morning' | 'active' | 'evening'

interface MotionData {
  isMoving: boolean
  intensity: number // 0-100
}

export function useContextMode() {
  const [mode, setMode] = useState<ContextMode>('morning')
  const [motion] = useState<MotionData>({ isMoving: false, intensity: 0 })

  // Mode reste sur celui sélectionné par l'utilisateur
  // Pas de détection automatique de mouvement ou de changement basé sur l'heure

  return { mode, setMode, motion }
}
