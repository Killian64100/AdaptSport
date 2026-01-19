'use client'

import { use, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useProtocolStore } from '@/store/useProtocolStore'

interface ProtocolDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProtocolDetailPage({ params }: ProtocolDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const { userProtocols } = useProtocolStore()

  // Récupérer le protocole depuis le store Zustand (protocoles dynamiques)
  const protocolData = userProtocols.find(p => p.id === id)
  
  // Rediriger si protocole non trouvé (dans useEffect pour éviter setState pendant render)
  useEffect(() => {
    if (!protocolData) {
      router.push('/coach?tab=library')
    }
  }, [protocolData, router])
  
  // Return early si pas de protocole (avant la redirection)
  if (!protocolData) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-void pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pb-6 pt-12"
        style={{ paddingTop: 'max(3rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => router.push('/coach?tab=library')}
          className="mb-4 flex items-center gap-2 text-body-m text-brand-electric"
        >
          <ArrowLeft size={20} weight="bold" />
          Library
        </button>

        <h1 className="font-display text-display-s text-text-highest">
          {protocolData.name}
        </h1>
        <p className="mt-2 text-body-m text-text-medium">
          {protocolData.description}
        </p>
      </motion.header>

      <div className="space-y-6 px-4">
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-3 rounded-xl bg-surface-card py-8"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated">
            {protocolData.category === 'sleep' && <span className="text-4xl">🌙</span>}
            {protocolData.category === 'nutrition' && <span className="text-4xl">🍽️</span>}
            {protocolData.category === 'cold' && <span className="text-4xl">❄️</span>}
            {protocolData.category === 'breathing' && <span className="text-4xl">🌬️</span>}
            {protocolData.category === 'mobility' && <span className="text-4xl">🧘</span>}
            {protocolData.category === 'stretching' && <span className="text-4xl">🤸</span>}
            {protocolData.category === 'activity' && <span className="text-4xl">🏃</span>}
          </div>
          <div className="text-center">
            <p className="text-caption font-medium uppercase tracking-wider text-text-low">
              {protocolData.category}
            </p>
            <p className="mt-1 text-body-m text-text-high">{protocolData.duration}</p>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-surface-card p-6"
        >
          <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
            Steps
          </h3>
          <ol className="space-y-4">
            {protocolData.steps.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex gap-4"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-electric text-body-s font-bold text-surface-void">
                  {index + 1}
                </span>
                <span className="flex-1 pt-1 text-body-m leading-relaxed text-text-high">{step}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-surface-card p-6"
        >
          <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
            Benefits
          </h3>
          <ul className="space-y-3">
            {protocolData.benefits.map((benefit, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="flex items-start gap-3"
              >
                <CheckCircle size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-signal-success" />
                <span className="flex-1 text-body-m leading-relaxed text-text-high">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* References */}
        {protocolData.references && protocolData.references.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl bg-surface-card p-6"
          >
            <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
              Scientific References
            </h3>
            <ul className="space-y-2">
              {protocolData.references.map((ref, index) => (
                <li key={index} className="text-body-s text-text-medium">
                  • {ref}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  )
}
