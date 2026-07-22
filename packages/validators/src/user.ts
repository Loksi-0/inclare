import { stringSchema } from '../shared/stringSchema'
import z from 'zod'

export const getOne = z.object({
  id: stringSchema()
})

export const checkExists = z.object({
  email: z.email()
})

export const setBan = z.object({
  id: stringSchema(),
  isBanned: z.boolean()
})

export const setAvatar = z.instanceof(FormData).transform((fd) => {
  const file = fd.get('file')

  return z
    .object({
      file: z.instanceof(File)
    })
    .parse({ file })
})

export const update = z.object({
  name: stringSchema().max(100).optional(),
  description: stringSchema().max(1000).optional()
})
