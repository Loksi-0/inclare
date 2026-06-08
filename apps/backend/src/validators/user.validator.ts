import { stringSchema } from '@/lib/zod-types/stringSchema.js'
import z from 'zod'

export const getOne = z.object({
  id: stringSchema()
})
