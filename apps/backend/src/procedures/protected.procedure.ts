import apiError from '@backend/shared/apiError'
import { ERROR_CODES } from '@repo/api-error-codes'
import { hybridProcedure } from './hybrid.procedure'
import { authErrors } from '@backend/modules/auth/auth.errors'
import { tokenService } from '@backend/modules/token/token.service'
import { authCookie } from '@backend/modules/auth/auth.cookie'

export const protectedProcedure = hybridProcedure.use(async ({ ctx, next }) => {
  if (!ctx.deviceId || !ctx.token || !ctx.user || !ctx.payload) {
    return authErrors.unauthorized(ctx.context)
  }

  if (ctx.user.isBanned) {
    return apiError(ERROR_CODES.REQUEST.FORBIDDEN)
  }

  const now = Date.now()
  const refreshDelay = 1000 * 60 * 60 * 24 * 5

  if (now - ctx.payload.iat * 1000 > refreshDelay) {
    const newToken = await tokenService.generateToken(ctx.payload)
    await tokenService.saveToken(newToken, ctx.payload)

    authCookie.setToken(ctx.context, newToken)
    authCookie.setDeviceId(ctx.context, ctx.deviceId)
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      payload: ctx.payload,
      token: ctx.token,
      deviceId: ctx.deviceId
    }
  })
})
