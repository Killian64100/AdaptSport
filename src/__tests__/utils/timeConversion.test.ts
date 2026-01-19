import { describe, it, expect } from 'vitest'

// Fonction utilitaire pour convertir une chaîne horaire en décimal
const timeToDecimal = (timeString: string): number => {
  const match = timeString.match(/^(\d+)h(\d+)$/)
  if (!match) return 0
  const hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  return hours + minutes / 60
}

// Fonction utilitaire pour convertir un décimal en chaîne horaire
const decimalToTime = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours)
  const minutes = Math.round((decimalHours - hours) * 60)
  if (minutes === 60) return `${hours + 1}h00`
  return `${hours}h${minutes.toString().padStart(2, '0')}`
}

describe('Time Conversion Utils', () => {
  describe('timeToDecimal', () => {
    it('should convert "7h30" to 7.5', () => {
      expect(timeToDecimal('7h30')).toBe(7.5)
    })

    it('should convert "8h00" to 8.0', () => {
      expect(timeToDecimal('8h00')).toBe(8.0)
    })

    it('should convert "5h12" to 5.2', () => {
      expect(timeToDecimal('5h12')).toBe(5.2)
    })

    it('should handle "6h45" correctly', () => {
      expect(timeToDecimal('6h45')).toBe(6.75)
    })

    it('should return 0 for invalid format', () => {
      expect(timeToDecimal('invalid')).toBe(0)
      expect(timeToDecimal('7:30')).toBe(0)
    })
  })

  describe('decimalToTime', () => {
    it('should convert 7.5 to "7h30"', () => {
      expect(decimalToTime(7.5)).toBe('7h30')
    })

    it('should convert 8.0 to "8h00"', () => {
      expect(decimalToTime(8.0)).toBe('8h00')
    })

    it('should round 7.501 to "7h30"', () => {
      expect(decimalToTime(7.501)).toBe('7h30')
    })

    it('should handle edge case where minutes round to 60', () => {
      expect(decimalToTime(7.999)).toBe('8h00')
    })

    it('should pad minutes with leading zero', () => {
      expect(decimalToTime(7.083)).toBe('7h05')
    })
  })

  describe('Round-trip conversion', () => {
    it('should maintain consistency in round-trip', () => {
      const original = '7h30'
      const decimal = timeToDecimal(original)
      const converted = decimalToTime(decimal)
      expect(converted).toBe(original)
    })

    it('should handle multiple round-trips', () => {
      const times = ['6h00', '6h30', '7h00', '7h30', '8h00', '8h30', '9h00']
      times.forEach((time) => {
        const decimal = timeToDecimal(time)
        const converted = decimalToTime(decimal)
        expect(converted).toBe(time)
      })
    })
  })
})
