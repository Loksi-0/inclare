export const formatTimestamp = (ms: number) => {
  const date = new Date(ms)
  const formattedDate = date
    .toLocaleString('ru-RU')
    .replaceAll(',', '')
    .slice(0, -3)

  return formattedDate
}
