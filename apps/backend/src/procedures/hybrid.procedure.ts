import { checkUser } from '@backend/helpers/checkUser'
import { parseJwtToken } from '@backend/helpers/parseJwtToken'
import { unauthorized } from '@backend/helpers/unauthorized'
import { publicProcedure } from '@backend/trpc'
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
    const { payload: checkedPayload, userId } = await checkUser({
      token: ctx.token,
      deviceId: ctx.deviceId,
      honoContext: ctx.honoContext
    })

    payload = checkedPayload

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
