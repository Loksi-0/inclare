const months: Record<number, string> = {
  1: 'jan',
  2: 'feb',
  3: 'mar',
  4: 'apr',
  5: 'may',
  6: 'june',
  7: 'july',
  8: 'aug',
  9: 'sep',
  10: 'oct',
  11: 'nov',
  12: 'dec'
}

export const dateToMonth = (date: Date) => {
  const month = date.getMonth() + 1

  return months[month] || 'jan'
}
