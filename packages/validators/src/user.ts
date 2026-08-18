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
      file: z.instanceof(File).optional().nullable()
    })
    .parse({ file })
})

export const update = z.object({
  name: stringSchema('Введите имя')
    .max(100, 'Максимальная длина ника - 100 символов')
    .optional(),
  description: z
    .string()
    .max(300, 'Максимальная длина описания - 300 символов')
    .optional()
    .nullable()
})
export type Update = z.infer<typeof update>
