export const formatPrice = (price: number, currency: boolean = true) => {
  const formatted = new Intl.NumberFormat(
    'ru-RU',
    currency
      ? {
          style: 'currency',
          currency: 'RUB',
          maximumFractionDigits: 0
        }
      : {
          maximumFractionDigits: 0
        }
  ).format(price)

  return formatted
}
