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
    .replace(/---/g, '<hr class="my-4 border-surface-elevated opacity-30"/>')
    // Legal disclaimer (very small, very discreet, minimal spacing)
    .replace(/_(.*)\_$/g, '<span class="block text-[10px] text-text-low opacity-50 italic mt-2">$1</span>')

  return formatted
}

export default function ChatBubble({ message, isLast }: ChatBubbleProps) {
  const [showAttribution, setShowAttribution] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addProtocol, addCustomProtocol, hasProtocol } = useProtocolStore()
  const { showSuccess } = useFeedback()
  const isUser = message.role === 'user'

  // Parse JSON responses from AI agent
  const parsedMessage = (() => {
    if (isUser || !message.content) {
      return { content: message.content, action: message.action }
    }

    // Try to extract JSON block from mixed text/JSON response
    try {
      const content = message.content
      
      // Regex to find JSON object in the message (including nested objects)
      const jsonRegex = /\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}/
      const match = content.match(jsonRegex)
      
      if (match) {
        const jsonStr = match[0]
        const jsonStartIndex = match.index || 0
        
        // Extract text before and after JSON
        const textBefore = content.substring(0, jsonStartIndex).trim()
        const textAfter = content.substring(jsonStartIndex + jsonStr.length).trim()
        
        // Try to parse the JSON
        try {
          const parsed = JSON.parse(jsonStr)
          
          // If it has response field, use it
          if (parsed.response) {
            // Combine: textBefore + parsed.response + textAfter
            const combinedContent = [
              textBefore,
              parsed.response,
              textAfter
            ].filter(Boolean).join('\n\n')
            
            return {
              content: combinedContent,
              action: parsed.action || message.action
            }
          }
        } catch (parseError) {
          // JSON parse failed, use original content
          console.warn('Failed to parse extracted JSON:', parseError)
        }
      }
      
      // No JSON found or parsing failed, check if entire content is JSON
      const trimmedContent = content.trim()
      if (trimmedContent.startsWith('{') && trimmedContent.endsWith('}')) {
        try {
          const parsed = JSON.parse(trimmedContent)
          
          if (parsed.response) {
            return {
              content: parsed.response,
              action: parsed.action || message.action
            }
          }
        } catch (e) {
          // Not valid JSON
        }
      }
    } catch (e) {
      console.warn('Error parsing message:', e)
    }

    // Fallback: use original content
    return { content: message.content, action: message.action }
  })()

  const handleAddProtocol = () => {
    const actionToUse = parsedMessage.action
    if (!actionToUse) return
    
    // Cas 1 : L'IA envoie un ID de protocole existant
    if (actionToUse.protocolId) {
      const protocol = getProtocolById(actionToUse.protocolId)
      if (!protocol) {
        console.error('Protocol not found:', actionToUse.protocolId)
        return
      }
      addProtocol(protocol)
      showSuccess(`${protocol.name} added to your library!`)
      setIsAdded(true)
    }
    // Case 2: AI sends complete protocol (innovation)
    else if (actionToUse.protocolData) {
      const newProtocol = addCustomProtocol(actionToUse.protocolData)
      showSuccess(`${newProtocol.name} added to your library!`)
      setIsAdded(true)
    }
    else {
      console.error('No protocolId or protocolData in action')
    }
  }

  // Vérifier si le protocole est déjà ajouté
  const isProtocolAdded = isAdded || (parsedMessage.action 
    ? parsedMessage.action.protocolId 
      ? hasProtocol(parsedMessage.action.protocolId) 
      : false
    : false)

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
              __html: formatMessageContent(parsedMessage.content, isUser) 
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
          {!isUser && parsedMessage.action && (
            <motion.button
              onClick={handleAddProtocol}
              disabled={isProtocolAdded}
              className={`mt-3 flex items-center gap-2 rounded-lg px-4 py-2.5 text-body-s font-semibold transition-all ${
                isProtocolAdded
                  ? 'bg-surface-elevated text-text-low cursor-not-allowed'
                  : 'bg-brand-electric text-surface-void hover:bg-brand-deep shadow-lg shadow-brand-electric/20'
              }`}
              whileHover={!isProtocolAdded ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isProtocolAdded ? { scale: 0.98 } : {}}
            >
              {isProtocolAdded ? (
                <>
                  <span className="text-green-400">✓</span>
                  Added to Library
                </>
              ) : (
                <>
                  <Plus size={18} weight="bold" />
                  {parsedMessage.action.label || 'Add to Library'}
                </>
              )}
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
