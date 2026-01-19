import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Surfaces
    'bg-surface-void',
    'bg-surface-global',
    'bg-surface-card',
    'bg-surface-elevated',
    'bg-surface-modal',
    
    // Brand
    'bg-brand-electric',
    'bg-brand-deep',
    'text-brand-electric',
    
    // Signals
    'bg-signal-success',
    'bg-signal-caution',
    'bg-signal-critical',
    'bg-signal-info',
    'text-signal-success',
    'text-signal-caution',
    'text-signal-critical',
    'text-signal-info',
    
    // Text
    'text-text-highest',
    'text-text-high',
    'text-text-medium',
    'text-text-low',
    
    // Data viz
    'bg-data-deep',
    'bg-data-rem',
    'bg-data-light',
    'bg-data-hrv',
    'bg-data-strain',
    'bg-data-recovery',
    'text-data-deep',
    'text-data-hrv',
    
    // Typography
    'font-display',
    'font-sans',
    'font-mono',
    'text-display-l',
    'text-display-m',
    'text-display-s',
    'text-body-l',
    'text-body-m',
    'text-body-s',
    'text-caption',
    'text-overline',
    'text-mono-l',
    'text-mono-m',
    'text-mono-s',
    
    // Borders
    'border-surface-card',
    'border-surface-elevated',
    'border-brand-electric',
    'border-signal-success',
    'border-signal-caution',
    'border-signal-critical',
    
    // Shadows
    'shadow-glow-sm',
    'shadow-glow-md',
    'shadow-glow-lg',
    'shadow-glow-success',
    'shadow-glow-critical',
    
    // Animations
    'animate-gradient',
    'animate-pulse-slow',
    'animate-fade-in',
    'animate-slide-up',
    'animate-gradient-shift',
    'animate-ai-thinking',
    'glow-pulse',
    
    // Border radius
    'rounded-sm',
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-full',
    
    // Opacity variants (common combinations)
    'bg-surface-void/50',
    'bg-surface-card/50',
    'bg-signal-success/10',
    'bg-signal-success/20',
    'bg-signal-caution/10',
    'bg-signal-caution/20',
    'bg-signal-critical/10',
    'bg-signal-critical/20',
    'bg-brand-electric/5',
    'bg-brand-electric/10',
    'bg-brand-electric/20',
    'border-surface-card/50',
    'border-brand-electric/30',
    'border-brand-electric/20',
    'border-signal-success/30',
    'border-signal-caution/30',
    'border-signal-critical/30',
  ],
  theme: {
    extend: {
      colors: {
        // ===== HELIX BIOLUMINESCENCE PALETTE =====
        // Surfaces (Profondeur via luminance)
        'surface-void': '#050505', // Fond principal (Profondeur infinie)
        'surface-global': '#0A0A0A', // Alternative anti-smearing
        'surface-card': '#161616', // Élévation 1 (conteneurs)
        'surface-elevated': '#242424', // Élévation 2 (modales, FAB)
        'surface-modal': '#2C2C2C', // Élévation 3 (priorité max)

        // Brand & Actions
        'brand-electric': '#2F80ED', // Bleu électrique (CTA primaires)
        'brand-deep': '#1A5FCC', // Bleu foncé (hover states)

        // Signaux (Statuts physiologiques)
        'signal-success': '#00E676', // Vert néon (Récupération optimale)
        'signal-caution': '#FFC400', // Ambre (Attention requise)
        'signal-critical': '#FF3D00', // Rouge-orangé (Arrêt immédiat)
        'signal-info': '#00D9FF', // Cyan (Information neutre)

        // Data Visualization
        'data-deep': '#D500F9', // Violet mystique (Sommeil profond)
        'data-rem': '#7C4DFF', // Violet clair (REM)
        'data-light': '#536DFE', // Bleu lavande (Sommeil léger)
        'data-hrv': '#00E5FF', // Cyan vif (VFC)
        'data-strain': '#FF6E40', // Corail (Effort)
        'data-recovery': '#69F0AE', // Vert menthe (Récupération)

        // Texte (Opacité intégrée pour simplification)
        'text-highest': '#F2F2F2', // 87% opacité (titres, chiffres clés)
        'text-high': '#E0E0E0', // 72% opacité (body principal)
        'text-medium': '#A0A0A0', // 54% opacité (légendes, labels)
        'text-low': '#6B6B6B', // 38% opacité (disabled, hints)

        // États & Overlays
        'overlay-dark': 'rgba(0, 0, 0, 0.72)',
        'overlay-light': 'rgba(255, 255, 255, 0.08)',

        // Gradients (définis en CSS custom properties)
        'gradient-bio-start': '#00E676',
        'gradient-bio-end': '#FF3D00',
        'gradient-mesh-1': '#2F80ED',
        'gradient-mesh-2': '#D500F9',
        'gradient-mesh-3': '#00E5FF',
      },
      fontFamily: {
        // Display (Titres, Grands chiffres)
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        // Body (Texte principal)
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Mono (Données tabulaires)
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        // Hiérarchie Display
        'display-l': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }], // 64px
        'display-m': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }], // 48px
        'display-s': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }], // 32px

        // Hiérarchie Body
        'body-l': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
        'body-m': ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // 16px
        'body-s': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px

        // Caption & Labels
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }], // 12px
        'overline': ['0.625rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.08em' }], // 10px

        // Mono (Métriques)
        'mono-l': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }], // 20px
        'mono-m': ['1rem', { lineHeight: '1.4', fontWeight: '500' }], // 16px
        'mono-s': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }], // 14px
      },
      spacing: {
        // Design System Grid (4px base)
        '1': '0.25rem', // 4px
        '2': '0.5rem', // 8px
        '3': '0.75rem', // 12px
        '4': '1rem', // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem', // 24px
        '8': '2rem', // 32px
        '10': '2.5rem', // 40px
        '12': '3rem', // 48px
        '16': '4rem', // 64px
        '20': '5rem', // 80px
        '24': '6rem', // 96px
      },
      borderRadius: {
        'sm': '0.375rem', // 6px (chips, badges)
        'md': '0.5rem', // 8px (cards)
        'lg': '0.75rem', // 12px (modales)
        'xl': '1rem', // 16px (grandes surfaces)
        '2xl': '1.5rem', // 24px (hero elements)
        'full': '9999px', // Cercles parfaits
      },
      boxShadow: {
        // Élévations (mode sombre = pas d'ombres, mais glow)
        'glow-sm': '0 0 8px rgba(47, 128, 237, 0.3)',
        'glow-md': '0 0 16px rgba(47, 128, 237, 0.4)',
        'glow-lg': '0 0 24px rgba(47, 128, 237, 0.5)',
        'glow-success': '0 0 16px rgba(0, 230, 118, 0.4)',
        'glow-critical': '0 0 16px rgba(255, 61, 0, 0.4)',
      },
      animation: {
        // Animations personnalisées
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'ai-thinking': 'aiThinking 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        aiThinking: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      backgroundImage: {
        // Gradients prédéfinis
        'gradient-bio': 'linear-gradient(135deg, var(--gradient-bio-start) 0%, var(--gradient-bio-end) 100%)',
        'gradient-mesh': 'radial-gradient(circle at 20% 50%, var(--gradient-mesh-1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--gradient-mesh-2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, var(--gradient-mesh-3) 0%, transparent 50%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Plugin personnalisé pour les utilitaires Helix
    function({ addUtilities }: any) {
      const newUtilities = {
        '.text-high-emphasis': {
          color: '#F2F2F2',
          opacity: '0.87',
        },
        '.text-medium-emphasis': {
          color: '#F2F2F2',
          opacity: '0.60',
        },
        '.text-disabled': {
          color: '#F2F2F2',
          opacity: '0.38',
        },
        '.surface-elevation-1': {
          backgroundColor: '#161616',
        },
        '.surface-elevation-2': {
          backgroundColor: '#242424',
        },
        '.surface-elevation-3': {
          backgroundColor: '#2C2C2C',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config
