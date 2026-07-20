import { stringSchema } from './stringSchema'

export const passwordSchema = stringSchema('Введите пароль')
  .min(6, 'Минимальная длина пароля - 6 символов')
  .max(80, 'Вот это у тебя конечно пароль царский. максимум - 80 символов')
