'use client'

import { motion } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'

interface WaveformVisualizerProps {
  /** Array of heart rate values in BPM */
  data: number[];
  /** Whether animation is playing */
  isPlaying?: boolean;
  /** Color of the waveform */
  color?: 'electric' | 'success' | 'caution' | 'critical';
  /** Show frequency spectrum (FFT simulation) */
  showSpectrum?: boolean;
  /** Animation speed multiplier */
  speed?: number;
  /** Container height in pixels */
  height?: number;
}

type ColorValue = {
  bar: string;
  glow: string;
};

const colorMap: Record<string, ColorValue> = {
  electric: {
    bar: 'bg-brand-electric',
    glow: 'shadow-lg shadow-brand-electric/50',
  },
  success: {
    bar: 'bg-signal-success',
    glow: 'shadow-lg shadow-signal-success/50',
  },
  caution: {
    bar: 'bg-signal-caution',
    glow: 'shadow-lg shadow-signal-caution/50',
  },
  critical: {
    bar: 'bg-signal-critical',
    glow: 'shadow-lg shadow-signal-critical/50',
  },
};

/**
 * Simple FFT simulation - transforms HR data into frequency bins
 * In production, use a proper FFT library like kissfft.js
 */
function simulateFFT(data: number[]): number[] {
  // Normalize heart rate data (30-200 BPM → 0-1)
  const normalized = data.map((v) => Math.max(0, Math.min(1, (v - 30) / 170)));

  // Create 15 frequency bins
  const bins = Array(15).fill(0);

  // Simple averaging into bins
  const binSize = Math.ceil(normalized.length / 15);
  for (let i = 0; i < 15; i++) {
    const start = i * binSize;
    const end = Math.min(start + binSize, normalized.length);
    const binValues = normalized.slice(start, end);
    bins[i] = binValues.reduce((a, b) => a + b, 0) / binValues.length;
  }

  return bins;
}

/**
 * Generate synthetic heart rate signal for demo
 */
function generateHeartRateSignal(length: number): number[] {
  const signal: number[] = [];
  const baseHR = 60 + Math.random() * 20;

  for (let i = 0; i < length; i++) {
    // Sinusoidal base + random variations
    const t = i / length;
    const sine = Math.sin(t * Math.PI * 4) * 10;
    const noise = (Math.random() - 0.5) * 5;
    signal.push(baseHR + sine + noise);
  }

  return signal;
}

export default function WaveformVisualizer({
  data,
  isPlaying = true,
  color = 'electric',
  showSpectrum = true,
  speed = 1,
  height = 120,
}: WaveformVisualizerProps) {
  const [spectrum, setSpectrum] = useState<number[]>([]);
  const [displayData, setDisplayData] = useState<number[]>(data);

  // Generate spectrum data
  useMemo(() => {
    const dataToUse = displayData.length > 0 ? displayData : generateHeartRateSignal(100);
    const fftResult = simulateFFT(dataToUse);
    setSpectrum(fftResult);
  }, [displayData]);

  // Update display data
  useEffect(() => {
    if (data.length > 0) {
      setDisplayData(data);
    }
  }, [data]);

  const colorValue = colorMap[color];
  const containerHeight = height;
  const barCount = 15;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-4"
    >
      {/* Waveform Container */}
      <div
        className="relative rounded-lg bg-surface-card/50 border border-surface-elevated overflow-hidden"
        style={{ height: `${containerHeight}px` }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`grid-${i}`}
              className="absolute w-full border-t border-surface-elevated/30"
              style={{ top: `${(i / 4) * 100}%` }}
            />
          ))}
        </div>

        {/* FFT Spectrum Bars (15-bar visualization) */}
        {showSpectrum && spectrum.length > 0 && (
          <div className="absolute inset-0 flex items-end justify-center gap-1 px-4 py-2">
            {spectrum.map((value, index) => (
              <motion.div
                key={`bar-${index}`}
                className={`flex-1 rounded-t-lg ${colorValue.bar} ${isPlaying ? colorValue.glow : ''} transition-all`}
                initial={{ height: 0 }}
                animate={{
                  height: `${Math.max(5, value * 100)}%`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: isPlaying ? (index * 0.02 * (1 / speed)) : 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Waveform line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color === 'electric' ? '#2F80ED' : color === 'success' ? '#00E676' : color === 'caution' ? '#FFC400' : '#FF3D00'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color === 'electric' ? '#2F80ED' : color === 'success' ? '#00E676' : color === 'caution' ? '#FFC400' : '#FF3D00'} stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {displayData.length > 1 && (
            <>
              {/* Area under curve */}
              <motion.path
                d={generatePathData(displayData, containerHeight)}
                fill="url(#waveGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: isPlaying ? 0.3 : 0.2 }}
              />

              {/* Line */}
              <motion.path
                d={generatePathData(displayData, containerHeight)}
                stroke={color === 'electric' ? '#2F80ED' : color === 'success' ? '#00E676' : color === 'caution' ? '#FFC400' : '#FF3D00'}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </>
          )}
        </svg>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-caption">
        <div className="text-text-secondary">
          {displayData.length > 0 ? `${displayData.length} data points` : 'No data'}
        </div>
        {displayData.length > 0 && (
          <div className="flex gap-4 text-text-medium">
            <div>
              Avg: <span className={colorValue.bar === 'bg-brand-electric' ? 'text-brand-electric' : colorValue.bar === 'bg-signal-success' ? 'text-signal-success' : colorValue.bar === 'bg-signal-caution' ? 'text-signal-caution' : 'text-signal-critical'}>
                {Math.round(displayData.reduce((a, b) => a + b) / displayData.length)}
              </span> BPM
            </div>
            <div>
              Max: <span className={colorValue.bar === 'bg-brand-electric' ? 'text-brand-electric' : colorValue.bar === 'bg-signal-success' ? 'text-signal-success' : colorValue.bar === 'bg-signal-caution' ? 'text-signal-caution' : 'text-signal-critical'}>
                {Math.round(Math.max(...displayData))}
              </span> BPM
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Generate SVG path data from heart rate array
 */
function generatePathData(data: number[], containerHeight: number): string {
  if (data.length === 0) return '';

  // Normalize to 0-1
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const normalized = data.map((v) => (v - min) / range);

  // Generate path points
  const width = 100; // percentage
  const points: [number, number][] = normalized.map((v, i) => {
    const x = (i / (normalized.length - 1)) * width;
    const y = 100 - v * 100; // invert Y for SVG
    return [x, y];
  });

  // Create smooth curve with quadratic bezier
  let pathData = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length; i++) {
    const cp = {
      x: (points[i - 1][0] + points[i][0]) / 2,
      y: (points[i - 1][1] + points[i][1]) / 2,
    };
    pathData += ` Q ${cp.x} ${cp.y} ${points[i][0]} ${points[i][1]}`;
  }

  // Close the path
  pathData += ` L ${points[points.length - 1][0]} 100 L 0 100 Z`;

  return pathData;
}
