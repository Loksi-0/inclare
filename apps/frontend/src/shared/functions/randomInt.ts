export const randomInt = (min: number, max: number) => {
  const normalizedMin = min > max ? max : min
  const normalizedMax = max < min ? min : max

  return (
    Math.floor(Math.random() * (normalizedMax + 1 - normalizedMin)) +
    normalizedMin
  )
}
