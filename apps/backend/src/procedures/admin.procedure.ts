import apiError from '@backend/shared/apiError'
import { ERROR_CODES } from '@repo/api-error-codes'
import { moderatorProcedure } from './moderator.procedure'

export const adminProcedure = moderatorProcedure.use(({ ctx, next }) => {
  if (ctx.user.role === 'MODERATOR') {
    return apiError(ERROR_CODES.REQUEST.FORBIDDEN)
  }

  return next()
})
