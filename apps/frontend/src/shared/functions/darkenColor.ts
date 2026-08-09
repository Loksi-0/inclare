export const darkenColor = (hex: string, percent: number) => {
  let cleanHex = hex.replaceAll('#', '')

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  const alpha = percent > 100 ? 1 : percent < 0 ? 0 : 1 - percent / 100

  const toHex = (val: number) => {
    return Math.floor(val).toString(16).padStart(2, '0')
  }

  return `#${toHex(r * alpha)}${toHex(g * alpha)}${toHex(b * alpha)}`
}
