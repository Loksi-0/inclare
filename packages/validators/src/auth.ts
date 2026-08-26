import { stringSchema } from '../shared/stringSchema'
import { passwordSchema } from '../shared/passwordSchema'
import z from 'zod'

export const register = z.object({
  email: z.email('Введите корректный email'),
  password: passwordSchema,
  name: stringSchema('Придумайте никнейм').max(
    100,
    'Максимальная длина ника - 100 символов'
  ),
  description: stringSchema('Придумайте описание', { optional: true })
    .max(300, 'Максимальная длина описания - 300 символов')
    .optional(),
  avatar: stringSchema('Добавьте аватарку', { optional: true })
    .max(500)
    .optional()
})
export type Register = z.infer<typeof register>

export const login = z.object({
  email: z.email('Введите корректный email'),
  password: passwordSchema
})
export type Login = z.infer<typeof login>
