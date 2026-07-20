import { stringSchema } from '../shared/stringSchema'
import z from 'zod'

export const payload = z.object({
  userId: stringSchema(),
  deviceId: stringSchema(),
  role: z.literal(['USER', 'MODERATOR']),
  exp: z.number(),
  iat: z.number()
})
export type Payload = z.infer<typeof payload>
