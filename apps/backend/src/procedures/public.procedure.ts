import { baseProcedure } from '@/trpc.js'

export const publicProcedure = baseProcedure.use(async ({ ctx, next }) => {
  let user = null

  if (ctx.userId) {
    user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId }
    })
  }

  return next({
    ctx: {
      ...ctx,
      user
    }
  })
})
