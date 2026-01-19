import { useEffect, useState } from 'react';
import type { TimeContext, UIContext } from '../types';

/**
 * Hook qui détermine le contexte temporel basé sur l'heure du jour
 * et l'activité détectée
 */
export function useTimeContext(): TimeContext {
  const [context, setContext] = useState<TimeContext>('morning');

  useEffect(() => {
    const updateContext = () => {
      const hour = new Date().getHours();

      // Morning: 5h-12h (focus recovery & readiness)
      if (hour >= 5 && hour < 12) {
        setContext('morning');
      }
      // Evening: 18h-23h (focus sleep & recovery)
      else if (hour >= 18 && hour < 23) {
        setContext('evening');
      }
      // Active: 12h-18h (assume training window)
      else {
        setContext('active');
      }
    };

    updateContext();
    const interval = setInterval(updateContext, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return context;
}

/**
 * Hook pour détecter le mouvement (accéléromètre simulation ou géolocalisation)
 * Retourne si l'utilisateur est en mouvement/entraînement
 */
export function useMovementDetection() {
  const [isMoving, setIsMoving] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  useEffect(() => {
    // Simuler la détection de mouvement
    // TODO: Intégrer DeviceMotionEvent API pour vrai accéléromètre
    
    const handleMouseMove = () => {
      setLastActivity(new Date());
    };

    // En production: utiliser DeviceMotionEvent ou Geolocation API
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { isMoving, lastActivity };
}

/**
 * Hook pour gérer le contexte UI adaptatif global
 */
export function useUIContext(): UIContext {
  const timeContext = useTimeContext();
  const { isMoving, lastActivity } = useMovementDetection();

  return {
    timeContext,
    userLevel: 'intermediate', // TODO: From user profile
    isMoving,
    lastActivityDetection: lastActivity,
  };
}

/**
 * Hook pour la gestion du "Just-in-Time" permission requests
 */
export function usePermissionRequest(type: 'location' | 'microphone' | 'health') {
  const [status, setStatus] = useState<'not-requested' | 'requesting' | 'granted' | 'denied'>('not-requested');

  const request = async () => {
    setStatus('requesting');
    try {
      switch (type) {
        case 'location':
          if ('geolocation' in navigator) {
            await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
          }
          break;
        case 'microphone':
          await navigator.mediaDevices.getUserMedia({ audio: true });
          break;
        // Health permissions require platform-specific APIs
      }
      setStatus('granted');
    } catch (error) {
      console.error(`Permission denied for ${type}:`, error);
      setStatus('denied');
    }
  };

  return { status, request };
}

/**
 * Hook pour contrôler l'adaptatibilité des couleurs selon le contexte
 */
export function useContextualColors(timeContext: TimeContext) {
  const colors = {
    morning: {
      primary: 'brand-electric', // Bleu énergisant
      accent: 'signal-success', // Vert pour la récupération
      background: 'surface-void',
    },
    active: {
      primary: 'signal-caution', // Ambre pour l'attention
      accent: 'data-strain', // Corail pour l'effort
      background: 'surface-void',
    },
    evening: {
      primary: 'data-deep', // Violet pour le sommeil
      accent: 'signal-info', // Cyan neutre
      background: 'surface-void',
    },
  };

  return colors[timeContext];
}
