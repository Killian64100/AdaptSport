/**
 * Generate deterministic geometric avatar based on pseudonym
 * Ensures anonymity while providing visual distinction
 */
export function generateGeometricAvatar(seed: string): React.ReactNode {
  // Simple hash function
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Generate deterministic colors
  const hue = Math.abs(hash) % 360
  const saturation = 60 + (Math.abs(hash) % 20)
  const lightness = 50 + (Math.abs(hash >> 8) % 20)

  const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  const color2 = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`

  // Generate shape pattern
  const shapeType = Math.abs(hash) % 4

  const shapes = [
    // Circles
    <>
      <circle cx="20" cy="20" r="18" fill={color1} />
      <circle cx="20" cy="20" r="10" fill={color2} />
    </>,
    // Squares
    <>
      <rect width="40" height="40" fill={color1} />
      <rect x="10" y="10" width="20" height="20" fill={color2} />
    </>,
    // Triangles
    <>
      <polygon points="20,2 38,38 2,38" fill={color1} />
      <polygon points="20,14 30,30 10,30" fill={color2} />
    </>,
    // Hexagon
    <>
      <polygon points="20,2 36,12 36,28 20,38 4,28 4,12" fill={color1} />
      <polygon points="20,10 30,16 30,24 20,30 10,24 10,16" fill={color2} />
    </>,
  ]

  return (
    <svg viewBox="0 0 40 40" className="h-full w-full rounded-full">
      {shapes[shapeType]}
    </svg>
  )
}
