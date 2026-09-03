import { prisma } from '@backend/context'
import { checkUser } from '@backend/modules/auth/auth.check'
import { publicProcedure } from '@backend/trpc'

export const hybridProcedure = publicProcedure.use(async ({ ctx, next }) => {
  let user = null
  let payload = null

  if (ctx.deviceId && ctx.token) {
    const { payload: checkedPayload, userId } = await checkUser({
      token: ctx.token,
      deviceId: ctx.deviceId,
      honoContext: ctx.context
    })

    payload = checkedPayload

    user = await prisma.user.findUnique({
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
