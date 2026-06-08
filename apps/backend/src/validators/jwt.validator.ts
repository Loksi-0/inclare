import { stringSchema } from '@/lib/zod-types/stringSchema.js'
import z from 'zod'

export const payload = z.object({
  userId: stringSchema(),
  deviceId: stringSchema(),
  role: z.literal(['USER', 'MODERATOR']),
  exp: z.number(),
  nbf: z.number(),
  iat: z.number(),
  iss: z.string()
})
export type Payload = z.infer<typeof payload>
