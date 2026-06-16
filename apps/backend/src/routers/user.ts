import apiError from '@/helpers/apiError'
import { hybridProcedure } from '@/procedures/hybrid.procedure'
import { moderatorProcedure } from '@/procedures/moderator.procedure'
import { router } from '@/trpc'
import { UserSchema } from '@/validators/index'
import type { Prisma, User } from '@db/client'
import { ERROR_CODES } from '@repo/api-error-codes'

export const userRouter = router({
  getAll: hybridProcedure.query(async ({ ctx }) => {
    const filters: Record<User['role'], Prisma.UserWhereInput> = {
      USER: { isPrivate: false, isBanned: false, role: 'USER' },
      MODERATOR: { role: 'USER' },
      ADMIN: {}
    }

    const users = await ctx.prisma.user.findMany({
      where: filters[ctx.user?.role || 'USER'],
      omit: { password: true }
    })

    return users
  }),

  getOne: hybridProcedure
    .input(UserSchema.getOne)
    .query(async ({ ctx, input }) => {
      const filters: Record<
        User['role'],
        Omit<Prisma.UserWhereUniqueInput, 'id'>
      > = {
        USER: { isPrivate: false, isBanned: false, role: 'USER' },
        MODERATOR: { role: 'USER' },
        ADMIN: {}
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
          ...filters[ctx.user?.role || 'USER']
        },
        omit: { password: true }
      })

      if (!user) {
        return apiError(ERROR_CODES.USER.NOT_FOUND)
      }

      return user
    }),

  setBan: moderatorProcedure
    .input(UserSchema.setBan)
    .mutation(async ({ ctx, input }) => {
      const candidate = await ctx.prisma.user.findUnique({
        where: { id: input.id }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.USER.NOT_FOUND)
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: { isBanned: input.isBanned },
        omit: { password: true }
      })

      return user
    })
})
