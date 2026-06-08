import apiError from '@/helpers/apiError.js'
import { protectedProcedure } from './protected.procedure.js'
import { ERROR_CODES } from '@repo/api-error-codes'

export const moderatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'MODERATOR') {
    return apiError(ERROR_CODES.REQUEST.FORBIDDEN)
  }

  return next()
})
