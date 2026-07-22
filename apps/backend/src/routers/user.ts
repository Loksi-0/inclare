import { USER_PROFILE } from '@backend/constants'
import apiError from '@backend/helpers/apiError'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import { moderatorProcedure } from '@backend/procedures/moderator.procedure'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { publicProcedure, router } from '@backend/trpc'
import { UserSchema } from '@repo/validators'
import type { Prisma, User } from '@db/client'
import { ERROR_CODES } from '@repo/api-error-codes'
import path from 'path'
import { createFolder } from '@backend/helpers/createFolder'
import { compressWebp } from '@backend/helpers/compressWebp'

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

  checkExists: publicProcedure
    .input(UserSchema.checkExists)
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email }
      })

      return !!user
    }),

  setAvatar: protectedProcedure
    .input(UserSchema.setAvatar)
    .mutation(async ({ ctx, input }) => {
      await createFolder(USER_PROFILE.PATH(ctx.user.id))

      const avatarPath = path.join(
        USER_PROFILE.PATH(ctx.user.id),
        'avatar.webp'
      )
      const avatarLink = `${USER_PROFILE.URL(ctx.user.id)}/avatar.webp`

      const bytes = await input.file.bytes()
      const imgBuffer = Buffer.from(bytes)

      await compressWebp({
        width: 150,
        height: 150,
        img: imgBuffer,
        fit: 'cover',
        output: avatarPath,
        animated: true
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
