'use client'

import * as React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
  attribute?: string
  value?: Record<string, string>
  [key: string]: any
}

export function ThemeProvider({ 
  children,
  ...props 
}: ThemeProviderProps) {
  React.useEffect(() => {
    // Force dark theme on document
    document.documentElement.classList.add('dark')
  }, [])

  return <>{children}</>
}
