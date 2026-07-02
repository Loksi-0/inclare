export const capitalize = (string: string) => {
  const firstLetter = string.charAt(0)
  const remainingLetters = string.slice(1)

  return `${firstLetter.toUpperCase()}${remainingLetters.toLowerCase()}`
}
