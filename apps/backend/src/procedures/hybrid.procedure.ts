import { parseJwtToken } from '@/helpers/parseJwtToken'
import { unauthorized } from '@/helpers/unauthorized'
import { publicProcedure } from '@/trpc'
import type { JwtSchema } from '@repo/validators'

const getValidUserId = (
  payload: JwtSchema.Payload | null,
  deviceId: string | undefined
) => {
  if (!payload || !deviceId) {
    return null
  }

  return payload.deviceId === deviceId ? payload.userId : null
}

export const hybridProcedure = publicProcedure.use(async ({ ctx, next }) => {
  let user = null
  let payload = null

  if (ctx.deviceId && ctx.token) {
    const dbToken = await ctx.prisma.token.findUnique({
      where: { token: ctx.token }
    })

    if (!dbToken) {
      return unauthorized(ctx.honoContext)
    }

    payload = await parseJwtToken(ctx.token)
    const userId = getValidUserId(payload, ctx.deviceId)

    if (!payload || !userId) {
      return unauthorized(ctx.honoContext)
    }

    user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true }
    })
  }

  return next({
    ctx: {
      ...ctx,
      user,
      payload
    }
  })
})
