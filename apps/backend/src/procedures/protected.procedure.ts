import apiError from '@/helpers/apiError'
import { publicProcedure } from '@/trpc'
import { ERROR_CODES } from '@repo/api-error-codes'
import type { JwtSchema } from '@/validators/index'
import { parseJwtToken } from '@/helpers/parseJwtToken'
import { TokenService } from '@/services/token.service'
import { setTokenCookie } from '@/helpers/tokenCookie'

const getValidUserId = (
  payload: JwtSchema.Payload | null,
  deviceId: string | undefined
) => {
  if (!payload || !deviceId) {
    return null
  }

  return payload.deviceId === deviceId ? payload.userId : null
}

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.deviceId || !ctx.token) {
    return apiError(ERROR_CODES.SESSION.UNAUTHORIZED)
  }

  const payload = await parseJwtToken(ctx.token)
  const userId = getValidUserId(payload, ctx.deviceId)

  if (!payload || !userId) {
    return apiError(ERROR_CODES.SESSION.UNAUTHORIZED)
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  })

  if (!user) {
    return apiError(ERROR_CODES.SESSION.UNAUTHORIZED)
  }

  if (user.isBanned) {
    return apiError(ERROR_CODES.REQUEST.FORBIDDEN)
  }

  const now = Date.now()
  const refreshDelay = 1000 * 60 * 60 * 24 * 5

  if (now - payload.iat * 1000 < refreshDelay) {
    const newToken = await TokenService.generateToken(payload)
    await TokenService.saveToken(newToken, payload)

    setTokenCookie(ctx.honoContext, newToken)
  }

  return next({
    ctx: {
      ...ctx,
      user,
      token: ctx.token,
      deviceId: ctx.deviceId
    }
  })
})
