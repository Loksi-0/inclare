import z from 'zod'

export const stringSchema = (message?: string) => {
  return z.string(message).refine((val) => !!val, {
    message
  })
}
