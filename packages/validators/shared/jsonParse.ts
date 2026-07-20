import z from 'zod'

export const jsonParse = (val: string, ctx: z.core.$RefinementCtx<string>) => {
  try {
    return JSON.parse(val) as unknown
  } catch {
    ctx.addIssue({
      code: 'custom',
      message: 'Невалидный JSON'
    })
    return z.NEVER
  }
}
