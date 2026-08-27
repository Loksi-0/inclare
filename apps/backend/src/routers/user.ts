import { USER_PROFILE } from '@backend/constants'
import apiError from '@backend/helpers/apiError'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import { moderatorProcedure } from '@backend/procedures/moderator.procedure'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { publicProcedure, router } from '@backend/trpc'
import { UserSchema } from '@repo/validators'
import type { Prisma, Role, User } from '@repo/db'
import { ERROR_CODES } from '@repo/api-error-codes'
import path from 'path'
import { createFolder } from '@backend/helpers/createFolder'
import { compressWebp } from '@backend/helpers/compressWebp'
import { getRandomAvatar } from '@backend/helpers/getRandomAvatar'
import cuid from '@bugsnag/cuid'
import { getFilePathByUrl } from '@backend/helpers/getFilePathByUrl'
import fs from 'fs/promises'

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
        USER: { isPrivate: false, isBanned: false },
        MODERATOR: { isPrivate: false },
        ADMIN: { isPrivate: false }
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

  findMany: hybridProcedure
    .input(UserSchema.findMany)
    .query(async ({ ctx, input }) => {
      const filters: Record<User['role'], Omit<Prisma.UserWhereInput, 'id'>> = {
        USER: { isPrivate: false, isBanned: false, role: 'USER' },
        MODERATOR: { isPrivate: false, role: 'USER' },
        ADMIN: { isPrivate: false, role: 'USER' }
      }

      const users = await ctx.prisma.user.findMany({
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
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
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

  setAvatar: protectedProcedure
    .input(UserSchema.setAvatar)
    .mutation(async ({ ctx, input }) => {
      await createFolder(USER_PROFILE.PATH(ctx.user.id))

      if (ctx.user.avatar) {
        const prevAvatarPath = getFilePathByUrl(ctx.user.avatar)

        if (!prevAvatarPath.includes(path.join('defaults', 'avatars'))) {
          await fs.unlink(prevAvatarPath)
        }
      }

      if (!input.file) {
        const avatarLink = await getRandomAvatar()

        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { avatar: avatarLink }
        })

        return avatarLink
      }

      const avatarId = cuid()
      const avatarName = `avatar_${avatarId}.webp`

      const avatarPath = path.join(USER_PROFILE.PATH(ctx.user.id), avatarName)
      const avatarLink = `${USER_PROFILE.URL(ctx.user.id)}/${avatarName}`

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
      const allowedRoles: Role[] =
        ctx.user.role === 'ADMIN' ? ['USER', 'MODERATOR'] : ['USER']

      const candidate = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
          role: {
            in: allowedRoles
          }
        }
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
    }),

  toggleIsPrivate: protectedProcedure.mutation(async ({ ctx }) => {
    const candidate = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id }
    })

    if (!candidate) {
      return apiError(ERROR_CODES.USER.NOT_FOUND)
    }

    const user = await ctx.prisma.user.update({
      where: { id: ctx.user.id },
      data: { isPrivate: !candidate.isPrivate },
      omit: { password: true }
    })

    return user
  })
})
