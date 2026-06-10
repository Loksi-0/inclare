import { stringSchema } from '@/lib/zod-types/stringSchema'
import z from 'zod'

export const register = z.object({
  email: z.email(),
  password: stringSchema().min(6).max(80),
  name: stringSchema().max(50)
})

export const login = z.object({
  email: z.email(),
  password: stringSchema().min(6).max(80)
})
