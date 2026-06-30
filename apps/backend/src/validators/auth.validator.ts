import { stringSchema } from '@/lib/zod-types/stringSchema'
import z from 'zod'

export const register = z.object({
  email: z.email(),
  password: stringSchema().min(6).max(80),
  name: stringSchema().max(100),
  description: stringSchema().max(1000).optional(),
  avatar: stringSchema().max(500).optional()
})

export const login = z.object({
  email: z.email(),
  password: stringSchema().min(6).max(80)
})
