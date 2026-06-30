import { USER_PROFILE } from '@/constants'
import apiError from '@/helpers/apiError'
import { compressJpeg } from '@/helpers/compressJpeg'
import { hybridProcedure } from '@/procedures/hybrid.procedure'
import { moderatorProcedure } from '@/procedures/moderator.procedure'
import { protectedProcedure } from '@/procedures/protected.procedure'
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

  setAvatar: protectedProcedure
    .input(UserSchema.setAvatar)
    .mutation(async ({ ctx, input }) => {
      const avatarPath = USER_PROFILE.PATH(ctx.user.id)
      const avatarLink = USER_PROFILE.URL(ctx.user.id)

      const bytes = await input.bytes()
      const imgBuffer = Buffer.from(bytes)

      await compressJpeg({
        width: 200,
        height: 200,
        img: imgBuffer,
        output: avatarPath
      })

      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { avatar: avatarLink }
      })

      return avatarLink
    }),

  update: protectedProcedure
    .input(UserSchema.update)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: ctx.user.id
        },
        data: {
          name: input.name,
          description: input.description
        }
      })

      return updatedUser
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
