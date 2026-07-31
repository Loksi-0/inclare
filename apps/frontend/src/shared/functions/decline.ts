export const decline = {
  male: (amount: number, word: string) => {
    if (amount >= 5 && amount <= 20) {
      return `${amount} ${word}ов`
    }

    if (amount.toString().endsWith('1')) {
      return `${amount} ${word}`
    }

    if (
      amount.toString().endsWith('2') ||
      amount.toString().endsWith('3') ||
      amount.toString().endsWith('4')
    ) {
      return `${amount} ${word}а`
    }

    return `${amount} ${word}ов`
  }
}
