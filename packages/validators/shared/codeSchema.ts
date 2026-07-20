import z from 'zod'

export const codeSchema = z
  .string('Код не указан')
  .length(6, 'Код неверной длины')
