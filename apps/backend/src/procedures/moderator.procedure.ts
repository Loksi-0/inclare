import apiError from '@/helpers/apiError'
import { protectedProcedure } from './protected.procedure'
import { ERROR_CODES } from '@repo/api-error-codes'

export const moderatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role === 'USER') {
    return apiError(ERROR_CODES.REQUEST.FORBIDDEN)
  }

  return next()
})
