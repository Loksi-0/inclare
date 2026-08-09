export const normalizeHex = (hex: string) => {
  let cleanHex = hex.replaceAll('#', '')
  const testRegex = /^[0-9a-f]+$/i

  if (
    (cleanHex.length !== 3 && cleanHex.length !== 6) ||
    !testRegex.test(cleanHex)
  ) {
    return hex // parsing value is not hex (color shortland, ex. 'red' or 'green'), skipping
  }

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  return `#${cleanHex}`
}
