'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneRight, Microphone } from '@phosphor-icons/react'
import ChatBubble from '@/components/helix/molecules/ChatBubble'
import AIThinkingState from './AIThinkingState'
import QuickSuggestions from './QuickSuggestions'
import { Button } from '@/components/ui/button'
import { useBiomarkerStore } from '@/store/useBiomarkerStore'
import mockData from '@/data/mock-health.json'

interface CustomProtocolData {
  name: string
  category?: 'breathing' | 'cold' | 'sleep' | 'nutrition' | 'activity' | 'mobility' | 'stretching'
  description?: string
  duration?: string
  durationSeconds?: number
  steps: string[]
  benefits: string[]
  references?: string[]
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  confidence?: number
  attribution?: AttributionData
  timestamp: Date
  action?: {
    type: 'add-protocol'
    protocolId?: string // ID d'un protocole existant
    protocolData?: CustomProtocolData // OU données complètes d'un nouveau protocole
    label: string
  }
}

interface AttributionData {
  factors: Array<{
    label: string
    impact: number
    direction: 'positive' | 'negative' | 'neutral'
  }>
}

export default function AIChat() {
  // Get current health data from store (updated by Mode Démo)
  const { recovery, strain, hrv, rhr, sleep, spo2, calories } = useBiomarkerStore()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialiser le Coach avec le contexte si disponible
  useEffect(() => {
    if (isInitialized) return
    
    const contextString = localStorage.getItem('coach_context')
    if (contextString) {
      try {
        const context = JSON.parse(contextString)
        const timeSinceContext = Date.now() - context.timestamp
        
        // Si le contexte a moins de 5 minutes, l'utiliser
        if (timeSinceContext < 5 * 60 * 1000) {
          const welcomeMessage: Message = {
            id: '1',
            role: 'assistant',
            content: `I see your recovery is at ${context.recovery}% with HRV of ${context.hrv}ms. ${
              context.recovery >= 75 
                ? "Excellent! You're ready for an intense session. What would you like to do today?"
                : context.recovery >= 50
                ? "You're in decent shape. I recommend moderate training. What do you have planned?"
                : "Your body needs rest. Let's talk about active recovery. What do you think?"
            }`,
            confidence: 85,
            timestamp: new Date(),
          }
          setMessages([welcomeMessage])
          localStorage.removeItem('coach_context')
          setIsInitialized(true)
          return
        } else {
          localStorage.removeItem('coach_context')
        }
      } catch (error) {
        console.warn('Erreur lecture contexte:', error)
      }
    }
    
    // Default message if no context
    const defaultMessage: Message = {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI coach. How can I help you optimize your training today?",
      confidence: 100,
      timestamp: new Date(),
    }
    setMessages([defaultMessage])
    setIsInitialized(true)
  }, [isInitialized])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Vérifier si on a eu une erreur 402 récemment (< 5 min)
    const lastError402 = localStorage.getItem('api_error_402_timestamp')
    if (lastError402) {
      const timeSinceError = Date.now() - parseInt(lastError402)
      const fiveMinutes = 5 * 60 * 1000
      
      if (timeSinceError < fiveMinutes) {
        const remainingTime = Math.ceil((fiveMinutes - timeSinceError) / 60000)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⏳ API temporairement indisponible (erreur 402). Réessayez dans ${remainingTime} min. En attendant, j'utilise l'analyse locale basée sur vos métriques actuelles : Récupération ${recovery}%, VFC ${hrv}ms, FC Repos ${rhr}bpm.`,
          confidence: 50,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, errorMessage])
        setIsThinking(false)
        return
      } else {
        localStorage.removeItem('api_error_402_timestamp')
      }
    }

    try {
      // Call Coach API with mode 'chat' + current health data
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          message: input,
          // Send current health data (updated by Mode Démo)
          currentHealthData: {
            today: {
              recovery,
              strain,
              hrv,
              rhr,
              sleep,
              spo2,
              calories,
            },
            history: mockData.history, // Keep history from JSON
            profile: mockData.profile,
          },
        }),
      })

      // Détecter erreur 402 et activer le cache
      if (!response.ok && response.status === 402) {
        localStorage.setItem('api_error_402_timestamp', Date.now().toString())
        throw new Error('API Error 402: Spend limit exceeded')
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        confidence: data.confidence,
        attribution: data.attribution,
        action: data.action, // Include action if present
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Chat API error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm experiencing a technical issue. Please try again in a moment.",
        confidence: 0,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsThinking(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    handleSend()
  }

  return (
    <div className="flex h-[calc(100vh-280px)] flex-col">
      {/* Messages Container */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatBubble
                message={message}
                isLast={index === messages.length - 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI Thinking State */}
        {isThinking && <AIThinkingState />}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {!isThinking && messages.length <= 2 && (
        <QuickSuggestions onSelect={handleSuggestion} />
      )}

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-4 flex gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your coach..."
            className="w-full rounded-lg border border-surface-elevated bg-surface-card px-4 py-3 pr-12 text-body-m text-text-highest placeholder:text-text-low focus:border-brand-electric focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 focus:ring-offset-surface-void"
          />
          <button
            onClick={() => console.log('Voice input')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-medium transition-colors hover:text-brand-electric"
          >
            <Microphone size={20} weight="bold" />
          </button>
        </div>

        <Button
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          className="h-12 w-12 bg-brand-electric p-0 hover:bg-brand-deep disabled:opacity-50"
        >
          <PaperPlaneRight size={20} weight="fill" />
        </Button>
      </motion.div>
    </div>
  )
}
