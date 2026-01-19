'use client'

import { useState, useCallback } from 'react'

type FeedbackType = 'success' | 'error' | 'warning' | 'info'

interface FeedbackState {
  type: FeedbackType
  message: string
  isVisible: boolean
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: 'info',
    message: '',
    isVisible: false,
  })

  const showFeedback = useCallback((type: FeedbackType, message: string) => {
    setFeedback({ type, message, isVisible: true })
  }, [])

  const hideFeedback = useCallback(() => {
    setFeedback(prev => ({ ...prev, isVisible: false }))
  }, [])

  return {
    feedback,
    showSuccess: (message: string) => showFeedback('success', message),
    showError: (message: string) => showFeedback('error', message),
    showWarning: (message: string) => showFeedback('warning', message),
    showInfo: (message: string) => showFeedback('info', message),
    hideFeedback,
  }
}
