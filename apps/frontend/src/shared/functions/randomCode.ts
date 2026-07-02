export const randomCode = (length: number) => {
  const digits = Math.round(Math.random() * 10 ** length)

  return digits.toString().padStart(length, '0')
}
