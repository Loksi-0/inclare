import apiError from '@/helpers/apiError.js'
import { publicProcedure, router } from '@/trpc.js'
import { UserSchema } from '@/validators/index.js'
import { ERROR_CODES } from '@repo/api-error-codes'

export const userRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: { isPrivate: false },
      omit: { password: true }
    })

    return users
  }),

  getOne: publicProcedure
    .input(UserSchema.getOne)
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
          isPrivate: false
        },
        omit: { password: true }
      })

      if (!user) {
        return apiError(ERROR_CODES.USER.NOT_FOUND)
      }

      return user
    })
})
