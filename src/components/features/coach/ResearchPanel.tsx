'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Brain, FolderOpen, LinkSimple, Spinner } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { searchScientificResearch, TavilyResearchContext } from '@/lib/services/tavily-api'

interface ResearchPanelProps {
  topic: string;
  autoSearch?: boolean;
}

export default function ResearchPanel({ topic, autoSearch = true }: ResearchPanelProps) {
  const [research, setResearch] = useState<TavilyResearchContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  useEffect(() => {
    if (autoSearch && topic) {
      performSearch();
    }
  }, [topic, autoSearch]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchScientificResearch(topic, 5);
      setResearch(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={20} weight="fill" className="text-brand-electric" />
          <h3 className="text-title-sm font-bold text-text-high">Evidence-Based Research</h3>
        </div>
        {!loading && research && (
          <button
            onClick={performSearch}
            className="text-caption text-brand-electric hover:text-brand-electric/80 transition-colors"
          >
            Refresh
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8 gap-3"
          >
            <Spinner size={20} weight="bold" className="text-brand-electric animate-spin" />
            <p className="text-body-xs text-text-secondary">Searching scientific literature...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-signal-critical/10 p-4 border border-signal-critical/20"
          >
            <p className="text-caption text-signal-critical font-medium">
              Unable to fetch research: {error}
            </p>
            <button
              onClick={performSearch}
              className="mt-2 text-caption text-brand-electric hover:text-brand-electric/80"
            >
              Try Again
            </button>
          </motion.div>
        ) : research ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-brand-electric/5 p-4 border border-brand-electric/20"
            >
              <p className="text-body-xs text-text-medium leading-relaxed">
                {research.summary}
              </p>
            </motion.div>

            {/* Key Findings */}
            {research.keyFindings.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-body-sm font-semibold text-text-high mb-2">Key Findings</h4>
                <div className="space-y-2">
                  {research.keyFindings.map((finding, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="flex gap-2 text-caption text-text-medium"
                    >
                      <span className="text-signal-success font-bold">✓</span>
                      <span>{finding}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Research Sources */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-body-sm font-semibold text-text-high mb-2">Research Sources</h4>
              <div className="space-y-2">
                {research.results.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setExpandedResult(expandedResult === idx ? null : idx)}
                      className={`w-full text-left rounded-lg p-3 border transition-all ${
                        expandedResult === idx
                          ? 'bg-surface-elevated border-brand-electric/30'
                          : 'bg-surface-card border-surface-card hover:border-brand-electric/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-body-xs font-semibold text-text-high truncate">
                            {result.title}
                          </h5>
                          <p className="text-caption text-text-secondary mt-0.5">
                            {result.source}{result.publishedDate && ` • ${result.publishedDate}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-caption font-bold text-brand-electric">
                              {Math.round(result.score * 100)}%
                            </div>
                            <p className="text-[10px] text-text-secondary">Match</p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedResult === idx && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-surface-elevated"
                          >
                            <p className="text-caption text-text-medium mb-3 line-clamp-3">
                              {result.content}
                            </p>
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-caption text-brand-electric hover:text-brand-electric/80 transition-colors"
                            >
                              <LinkSimple size={14} />
                              Read full article
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-surface-card p-6 text-center"
          >
            <FolderOpen size={32} className="mx-auto mb-2 text-text-tertiary" />
            <p className="text-body-xs text-text-secondary">No research data loaded yet</p>
            <button
              onClick={performSearch}
              className="mt-3 text-caption text-brand-electric hover:text-brand-electric/80 transition-colors"
            >
              Search Research
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
