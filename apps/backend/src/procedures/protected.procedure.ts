import apiError from '@/helpers/apiError'
import { ERROR_CODES } from '@repo/api-error-codes'
import { TokenService } from '@/services/token.service'
import { setTokenCookie } from '@/helpers/tokenCookie'
import { unauthorized } from '@/helpers/unauthorized'
import { hybridProcedure } from './hybrid.procedure'
import { setDeviceIdCookie } from '@/helpers/deviceIdCookie'

export const protectedProcedure = hybridProcedure.use(async ({ ctx, next }) => {
  if (!ctx.deviceId || !ctx.token || !ctx.user || !ctx.payload) {
    return unauthorized(ctx.honoContext)
  }

  if (ctx.user.isBanned) {
    return apiError(ERROR_CODES.REQUEST.FORBIDDEN)
  }

  const now = Date.now()
  const refreshDelay = 1000 * 60 * 60 * 24 * 5

  if (now - ctx.payload.iat * 1000 > refreshDelay) {
    const newToken = await TokenService.generateToken(ctx.payload)
    await TokenService.saveToken(newToken, ctx.payload)

    setTokenCookie(ctx.honoContext, newToken)
    setDeviceIdCookie(ctx.honoContext, ctx.deviceId)
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
