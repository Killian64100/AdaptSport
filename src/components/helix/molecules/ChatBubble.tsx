'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Brain, Question, Plus } from '@phosphor-icons/react'
import ConfidencePill from '../atoms/ConfidencePill'
import AttributionModal from './AttributionModal'
import { useProtocolStore } from '@/store/useProtocolStore'
import { getProtocolById } from '@/data/protocols'
import { useFeedback } from '@/hooks/useFeedback'

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

interface ChatBubbleProps {
  message: Message
  isLast: boolean
}

/**
 * Format message content with markdown-like support
 * - **bold** → <strong class="text-brand-electric font-semibold">
 * - • bullets → styled bullets
 * - Line breaks preserved
 * - Legal disclaimer styled differently
 */
function formatMessageContent(content: string, isUser: boolean): string {
  // Safety check: return empty string if content is undefined/null
  if (!content) {
    return ''
  }

  if (isUser) {
    // User messages: simple escaping
    return content.replace(/\n/g, '<br/>')
  }

  // AI messages: format markdown + legal disclaimer
  let formatted = content
    // Bold text → neon highlight
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-electric font-semibold">$1</strong>')
    // Bullet lists
    .replace(/^•\s/gm, '<span class="text-brand-electric mr-2">•</span>')
    // Line breaks
    .replace(/\n/g, '<br/>')
    // Horizontal separator
    .replace(/---/g, '<hr class="my-3 border-surface-elevated"/>')
    // Legal disclaimer (italic + smaller)
    .replace(/_(.*)_$/g, '<em class="text-caption text-text-low italic">$1</em>')

  return formatted
}

export default function ChatBubble({ message, isLast }: ChatBubbleProps) {
  const [showAttribution, setShowAttribution] = useState(false)
  const { addProtocol, addCustomProtocol, hasProtocol } = useProtocolStore()
  const { showSuccess } = useFeedback()
  const isUser = message.role === 'user'

  const handleAddProtocol = () => {
    if (!message.action) return
    
    // Cas 1 : L'IA envoie un ID de protocole existant
    if (message.action.protocolId) {
      const protocol = getProtocolById(message.action.protocolId)
      if (!protocol) {
        console.error('Protocol not found:', message.action.protocolId)
        return
      }
      addProtocol(protocol)
      showSuccess(`${protocol.name} added to your library!`)
    }
    // Case 2: AI sends complete protocol (innovation)
    else if (message.action.protocolData) {
      const newProtocol = addCustomProtocol(message.action.protocolData)
      showSuccess(`${newProtocol.name} added to your library!`)
    }
    else {
      console.error('No protocolId or protocolData in action')
    }
  }

  // Vérifier si le protocole est déjà ajouté (par ID ou par nom pour les custom)
  const isProtocolAdded = message.action 
    ? message.action.protocolId 
      ? hasProtocol(message.action.protocolId) 
      : false // Pour les custom, on ne peut pas vérifier avant création (ID généré dynamiquement)
    : false

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-brand-electric' : 'bg-surface-elevated'
        }`}
      >
        {isUser ? (
          <User size={20} weight="fill" className="text-surface-void" />
        ) : (
          <Brain size={20} weight="fill" className="text-brand-electric" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-[85%] rounded-2xl p-4 ${
            isUser
              ? 'rounded-tr-sm bg-brand-electric text-surface-void'
              : 'rounded-tl-sm bg-surface-card text-text-high'
          }`}
        >
          {/* Message Content with Markdown support */}
          <div 
            className={`text-body-m leading-relaxed ${!isUser ? 'text-text-high' : ''}`}
            dangerouslySetInnerHTML={{ 
              __html: formatMessageContent(message.content, isUser) 
            }}
          />

          {/* AI Metadata (Confidence + Attribution) */}
          {!isUser && message.confidence && (
            <div className="mt-3 flex items-center gap-2">
              <ConfidencePill confidence={message.confidence} />

              {message.attribution && (
                <button
                  onClick={() => setShowAttribution(true)}
                  className="flex items-center gap-1 rounded-full bg-surface-elevated px-3 py-1 text-caption text-text-medium transition-colors hover:bg-surface-modal hover:text-text-high"
                >
                  <Question size={14} weight="bold" />
                  Why?
                </button>
              )}
            </div>
          )}

          {/* Action Button (Add to Library) */}
          {!isUser && message.action && (
            <motion.button
              onClick={handleAddProtocol}
              disabled={isProtocolAdded}
              className={`mt-3 flex items-center gap-2 rounded-lg px-4 py-2 text-caption font-medium transition-all ${
                isProtocolAdded
                  ? 'bg-surface-elevated text-text-low cursor-not-allowed'
                  : 'bg-brand-electric text-surface-void hover:bg-brand-deep'
              }`}
              whileHover={!isProtocolAdded ? { scale: 1.02 } : {}}
              whileTap={!isProtocolAdded ? { scale: 0.98 } : {}}
            >
              <Plus size={16} weight="bold" />
              {isProtocolAdded ? 'Already in library' : message.action.label}
            </motion.button>
          )}

          {/* Timestamp */}
          <p 
            className={`mt-2 text-caption ${isUser ? 'text-surface-void opacity-70' : 'text-text-low'}`}
            suppressHydrationWarning
          >
            {message.timestamp.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </motion.div>
      </div>

      {/* Attribution Modal */}
      <AnimatePresence>
        {showAttribution && message.attribution && (
          <AttributionModal
            attribution={message.attribution}
            onClose={() => setShowAttribution(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
