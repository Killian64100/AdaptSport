'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { TimeContext } from '@/lib/types';
import { useTimeContext } from '@/lib/hooks';
import { useBiomarkerStore } from '@/store/useBiomarkerStore';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout - Layout adaptatif principal
 * Morphe selon le contexte temporel et l'état de l'utilisateur
 * 
 * Mode Morning: Récupération & Readiness (couleurs énergisantes)
 * Mode Active: Effort & Performance (contraste maximal, très lisible)
 * Mode Evening: Sommeil & Récupération (couleurs douces, lumière bleue réduite)
 */
export function AppLayout({ children }: LayoutProps) {
  const timeContext = useTimeContext();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isSimulating, startDemoMode, stopDemoMode } = useBiomarkerStore();

  const toggleDemoMode = () => {
    if (isSimulating) {
      stopDemoMode();
    } else {
      startDemoMode();
    }
  };

  const getContextClasses = () => {
    const baseClasses = 'min-h-screen transition-colors duration-1000';
    const baseStyle = { backgroundColor: '#0A0A0A', color: '#F2F2F2' };

    switch (timeContext) {
      case 'morning':
        return baseClasses;
      case 'active':
        // Mode actif: contraste maximal
        return baseClasses;
      case 'evening':
        return baseClasses;
      default:
        return baseClasses;
    }
  };

  const getContextStyle = (): React.CSSProperties => {
    switch (timeContext) {
      case 'morning':
        return { backgroundColor: '#0A0A0A', color: '#F2F2F2' };
      case 'active':
        return { backgroundColor: '#050505', color: '#F2F2F2' };
      case 'evening':
        return { backgroundColor: '#0A0A0A', color: '#F2F2F2' };
      default:
        return { backgroundColor: '#0A0A0A', color: '#F2F2F2' };
    }
  };

  return (
    <div className={getContextClasses()} style={getContextStyle()}>
      {/* Mode démo indicator */}
      {isSimulating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-brand-electric/20 backdrop-blur-md border border-brand-electric px-4 py-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-brand-electric"
          />
          <span className="text-body-s font-medium text-brand-electric">Demo Mode Active</span>
        </motion.div>
      )}
      
      {/* Header contextuel avec IA */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', borderColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo & Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-electric to-signal-success flex items-center justify-center">
              <span className="text-white font-bold text-sm">AS</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-display-s text-text-highest">
                AdaptSport
              </h1>
              {timeContext === 'morning' && (
                <p className="text-caption text-text-medium">Hello, ready to perform</p>
              )}
              {timeContext === 'active' && (
                <p className="text-caption text-signal-info">In Activity</p>
              )}
              {timeContext === 'evening' && (
                <p className="text-caption text-text-medium">Good evening, time to recover</p>
              )}
            </div>
          </div>

          {/* Navigation toggle (mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hidden sm:block p-2 rounded-lg hover:bg-surface-card transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
              Demo Mode Button */}
          <motion.button
            onClick={toggleDemoMode}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-body-s transition-colors ${
              isSimulating
                ? 'bg-brand-electric text-white'
                : 'bg-surface-elevated text-text-medium hover:bg-surface-modal hover:text-text-high'
            }`}
          >
            {isSimulating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                  </svg>
                </motion.div>
                <span>Stop</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Demo Mode</span>
              </>
            )}
          </motion.<div>
              <h3 className="font-display font-semibold text-text-highest mb-3">
                Dashboard
              </h3>
              <nav className="space-y-2">
                {['The Pulse', 'Intelligence', 'Protocol'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-text-medium hover:text-brand-electric text-body-s transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-highest mb-3">
                Community
              </h3>
              <nav className="space-y-2">
                {['Tribe', 'Challenges', 'Profile'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-text-medium hover:text-brand-electric text-body-s transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-highest mb-3">
                Integrations
              </h3>
              <nav className="space-y-2">
                {['Oura', 'Garmin', 'Apple Health'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-text-medium hover:text-brand-electric text-body-s transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-highest mb-3">
                Legal
              </h3>
              <nav className="space-y-2">
                {['Privacy', 'Security', 'Terms'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-text-medium hover:text-brand-electric text-body-s transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-surface-elevated pt-6 flex items-center justify-between">
            <p className="text-caption text-text-low">
              © 2026 AdaptSport. Precision bio-hacking powered by AI.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-caption text-text-low">
                <div className="w-2 h-2 rounded-full bg-signal-success animate-pulse" />
                <span>System operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
