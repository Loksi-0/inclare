import z from 'zod'

export const stringSchema = (
  message?: string,
  options?: { optional?: boolean }
) => {
  if (options?.optional) {
    return z.string(message)
  }

  return z.string(message).refine((val) => !!val, {
    message
  })
}
