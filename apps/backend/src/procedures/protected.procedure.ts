import apiError from '@/helpers/apiError'
import { publicProcedure } from '@/trpc'
import { ERROR_CODES } from '@repo/api-error-codes'
import type { JwtSchema } from '@/validators/index'
import { parseJwtToken } from '@/helpers/parseJwtToken'
import { TokenService } from '@/services/token.service'
import { setTokenCookie } from '@/helpers/tokenCookie'
import { unauthorized } from '@/helpers/unauthorized'

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
    return unauthorized(ctx.honoContext)
  }

  const dbToken = await ctx.prisma.token.findUnique({
    where: { token: ctx.token }
  })

  if (!dbToken) {
    return unauthorized(ctx.honoContext)
  }

  const payload = await parseJwtToken(ctx.token)
  const userId = getValidUserId(payload, ctx.deviceId)

  if (!payload || !userId) {
    return unauthorized(ctx.honoContext)
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  })

  if (!user) {
    return unauthorized(ctx.honoContext)
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
