import z from 'zod'

export const HeadersSchema = z.looseObject({
  userAgent: z.string().optional(),
  fingerprint: z.string('Для выполнения запроса необходим fingerprint'),
  ip: z.string().optional()
})
export type Headers = z.infer<typeof HeadersSchema>
