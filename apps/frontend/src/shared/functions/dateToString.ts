export const dateToString = (date: Date) => {
  return date
    .toLocaleString('ru-RU', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
    .replaceAll(',', '')
}
