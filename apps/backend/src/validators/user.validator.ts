import { stringSchema } from '@/lib/zod-types/stringSchema'
import z from 'zod'

export const getOne = z.object({
  id: stringSchema()
})

export const setBan = z.object({
  id: stringSchema(),
  isBanned: z.boolean()
})
