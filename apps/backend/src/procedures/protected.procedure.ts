import apiError from '@/helpers/apiError.js'
import { publicProcedure } from './public.procedure.js'
import { ERROR_CODES } from '@repo/api-error-codes'

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    return apiError(ERROR_CODES.SESSION.UNAUTHORIZED)
  }

  if (ctx.user.isBanned) {
    return apiError(ERROR_CODES.REQUEST.FORBIDDEN)
  }

  return next({ ctx: { ...ctx, user: ctx.user } })
})
