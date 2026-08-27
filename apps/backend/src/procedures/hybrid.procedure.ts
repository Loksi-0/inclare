import { checkUser } from '@backend/helpers/checkUser'
import { publicProcedure } from '@backend/trpc'

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
