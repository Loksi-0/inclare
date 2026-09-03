import { USER_FOLDER } from '@backend/constants'
import apiError from '@backend/shared/apiError'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { publicProcedure, router } from '@backend/trpc'
import { UserSchema } from '@repo/validators'
import type { Prisma, User } from '@repo/db'
import { ERROR_CODES } from '@repo/api-error-codes'
import fs from 'fs/promises'
import { prisma } from '@backend/context'
import { userService } from './user.service'
import { authCookie } from '../auth/auth.cookie'

export const userRouter = router({
  getAll: hybridProcedure.query(async ({ ctx }) => {
    const filters: Record<User['role'], Prisma.UserWhereInput> = {
      USER: { isPrivate: false, isBanned: false, role: 'USER' },
      MODERATOR: { role: 'USER' },
      ADMIN: {}
    }

    const users = await prisma.user.findMany({
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
        USER: { isPrivate: false, isBanned: false },
        MODERATOR: { isPrivate: false },
        ADMIN: { isPrivate: false }
      }

      const user = await prisma.user.findUnique({
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

  findMany: hybridProcedure
    .input(UserSchema.findMany)
    .query(async ({ ctx, input }) => {
      const filters: Record<User['role'], Omit<Prisma.UserWhereInput, 'id'>> = {
        USER: { isPrivate: false, isBanned: false, role: 'USER' },
        MODERATOR: { isPrivate: false, role: 'USER' },
        ADMIN: { isPrivate: false, role: 'USER' }
      }

      const users = await prisma.user.findMany({
        where: {
          ...filters[ctx.user?.role || 'USER'],
          OR: [
            { id: { startsWith: input.query } },
            { name: { startsWith: input.query } },
            { email: { startsWith: input.query } }
          ]
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          isBanned: true
        }
      })

      return users
    }),

  checkExists: publicProcedure
    .input(UserSchema.checkExists)
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email }
      })

      return !!user
    }),

  checkMeIsBanned: hybridProcedure.query(({ ctx }) => {
    if (!ctx.user) {
      return false
    }

    return ctx.user.isBanned
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const photosCount = await prisma.post.findMany({
      where: { authorId: ctx.user.id },
      select: {
        _count: {
          select: {
            photos: true
          }
        }
      }
    })

    return {
      ...ctx.user,
      totalArchived: photosCount.reduce((acc, p) => acc + p._count.photos, 0)
    }
  }),

  setAvatar: protectedProcedure
    .input(UserSchema.setAvatar)
    .mutation(async ({ ctx, input }) => {
      const avatarLink = await userService.setAvatar({
        userId: ctx.user.id,
        avatar: ctx.user.avatar,
        file: input.file
      })

      return avatarLink
    }),

  update: protectedProcedure
    .input(UserSchema.update)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await prisma.user.update({
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

  toggleIsPrivate: protectedProcedure.mutation(async ({ ctx }) => {
    const candidate = await prisma.user.findUnique({
      where: { id: ctx.user.id }
    })

    if (!candidate) {
      return apiError(ERROR_CODES.USER.NOT_FOUND)
    }

    const user = await prisma.user.update({
      where: { id: ctx.user.id },
      data: { isPrivate: !candidate.isPrivate },
      omit: { password: true }
    })

    return user
  }),

  deleteMe: protectedProcedure.mutation(async ({ ctx }) => {
    await prisma.user.delete({ where: { id: ctx.user.id } })
    await fs.rm(USER_FOLDER.PATH(ctx.user.id), { recursive: true, force: true })
    authCookie.deleteToken(ctx.context)
  })
})
