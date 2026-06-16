import { stringSchema } from '@/lib/zod-types/stringSchema'
import z from 'zod'

export const getOne = z.object({
  id: stringSchema()
})

export const create = z.object({
  description: stringSchema().optional()
})

export const getFeed = z
  .object({
    limit: z.number().optional()
  })
  .optional()
