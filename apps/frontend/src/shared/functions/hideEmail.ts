export const hideEmail = (email: string) => {
  const emailParts = email.split('@')
  const emailBody = emailParts[0]
  const hiddenBody = `${emailBody.slice(0, 2)}${'*'.repeat(emailBody.length - 4)}${emailBody.slice(emailBody.length - 2, emailBody.length)}`

  return `${hiddenBody}@${emailParts[1]}`
}
