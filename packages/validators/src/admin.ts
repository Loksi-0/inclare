import z from 'zod'
import { stringSchema } from '../shared/stringSchema'

export const setIsModerator = z.object({
  id: stringSchema(),
  isModerator: z.boolean()
})

export const setGravity = z.object({
  gravity: z.number().positive().min(1)
})

export const setFallingStarK = z.object({
  K: z.number().positive().min(1.1)
})

export const setFallingStarIntervals = z
  .object({
    past: z.number().positive().int().optional(),
    now: z.number().positive().int().optional()
  })
  .superRefine((d, ctx) => {
    if (d.now && d.past && d.now > d.past) {
      ctx.addIssue('Now не может быть больше past')
    }
  })
