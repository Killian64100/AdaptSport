'use client'

import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useContextMode, type ContextMode } from '@/hooks/useContextMode'

interface ContextModeContextType {
  mode: ContextMode
  setMode: (mode: ContextMode) => void
  motion: {
    isMoving: boolean
    intensity: number
  }
}

const ContextModeContext = createContext<ContextModeContextType | undefined>(undefined)

export function ContextModeProvider({ children }: { children: ReactNode }) {
  const contextMode = useContextMode()

  // Apply mode-specific styles to body
  useEffect(() => {
    document.body.dataset.contextMode = contextMode.mode
  }, [contextMode.mode])

  return (
    <ContextModeContext.Provider value={contextMode}>
      {children}
    </ContextModeContext.Provider>
  )
}

export function useContextModeContext() {
  const context = useContext(ContextModeContext)
  if (!context) {
    throw new Error('useContextModeContext must be used within ContextModeProvider')
  }
  return context
}
