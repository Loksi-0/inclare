import { ALGORITHM_DEFAULTS, REDIS_KEYS } from '@backend/constants'
import apiError from '@backend/shared/apiError'
import { adminProcedure } from '@backend/procedures/admin.procedure'
import { router } from '@backend/trpc'
import { AdminSchema, PostSchema, UserSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { prisma, redis } from '@backend/context'
import { moderatorService } from './moderator.service'
import { moderatorProcedure } from '@backend/procedures/moderator.procedure'
import type { Role } from '@repo/db'
import { feedEmitter } from '../feed/feed.emitter'

export const moderatorRouter = router({
  getModerators: adminProcedure.query(async () => {
    const moderators = await prisma.user.findMany({
      where: { role: 'MODERATOR' },
      omit: { password: true }
    })

    return moderators
  }),

  getModerator: adminProcedure
    .input(UserSchema.getOne)
    .query(async ({ input }) => {
      const moderator = await prisma.user.findUnique({
        where: { id: input.id, role: 'MODERATOR' },
        omit: { password: true }
      })

      if (!moderator) {
        return apiError(ERROR_CODES.USER.NOT_FOUND)
      }

      return moderator
    }),

  setIsModerator: adminProcedure
    .input(AdminSchema.setIsModerator)
    .mutation(async ({ input }) => {
      const candidate = await prisma.user.findUnique({
        where: { id: input.id }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.USER.NOT_FOUND)
      }

      const user = await prisma.user.update({
        where: { id: input.id },
        data: {
          role: input.isModerator ? 'MODERATOR' : 'USER'
        }
      })

      return user
    }),

  spawnFallingStar: adminProcedure.mutation(async () => {
    const post = await prisma.post.findFirst({
      where: {
        isDrafted: false,
        author: {
          isBanned: false,
          isPrivate: false
        }
      }
    })

    if (!post) {
      return
    }

    feedEmitter.emit('falling-star', post.id)
  }),

  setAlgorithmGravity: adminProcedure
    .input(AdminSchema.setGravity)
    .mutation(async ({ input }) => {
      const newGravity = input.gravity

      if (newGravity < 1) {
        return apiError(ERROR_CODES.CONFIG.WRONG_GRAVITY)
      }

      await redis.hSet(REDIS_KEYS.CONFIG.ALGORITHM, 'gravity', newGravity)

      return newGravity
    }),

  banUser: moderatorProcedure
    .input(UserSchema.setBan)
    .mutation(async ({ ctx, input }) => {
      const allowedRoles: Role[] =
        ctx.user.role === 'ADMIN' ? ['USER', 'MODERATOR'] : ['USER']

      const candidate = await prisma.user.findUnique({
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

      const user = await prisma.user.update({
        where: { id: input.id },
        data: { isBanned: input.isBanned },
        omit: { password: true }
      })

      return user
    }),

  setFallingStarCoefficient: adminProcedure
    .input(AdminSchema.setFallingStarK)
    .mutation(async ({ input }) => {
      const newK = input.K

      if (newK < 1.1) {
        return apiError(ERROR_CODES.CONFIG.WRONG_FALLING_STAR_K)
      }

      await redis.hSet(REDIS_KEYS.CONFIG.ALGORITHM, 'k_coefficient', newK)

      return newK
    }),

  setFallingStarIntervals: adminProcedure
    .input(AdminSchema.setFallingStarIntervals)
    .mutation(async ({ input }) => {
      const intervals = await moderatorService.setFallingStarIntervals(input)

      return intervals
    }),

  getConfig: adminProcedure.query(async () => {
    const config = await redis.hGetAll(REDIS_KEYS.CONFIG.ALGORITHM)

    return {
      fallingStarK: parseFloat(config.k_coefficient || ALGORITHM_DEFAULTS.K),
      alogrithmGravity: parseFloat(
        config.gravity || ALGORITHM_DEFAULTS.GRAVITY
      ),
      pastInterval: parseFloat(
        config.past_interval || ALGORITHM_DEFAULTS.PAST_INTERVAL
      ),
      nowInterval: parseFloat(
        config.now_interval || ALGORITHM_DEFAULTS.NOW_INTERVAL
      )
    }
  }),

  getModeratingPosts: moderatorProcedure.query(async () => {
    const posts = await moderatorService.getModeratingPosts()

    return posts
  }),

  markPostAsViewed: moderatorProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ input }) => {
      const fiveDaysSeconds = 60 * 60 * 24 * 5

      await redis.sAdd(REDIS_KEYS.MODERATOR.VIEWED, input.id)
      await redis.expire(REDIS_KEYS.MODERATOR.VIEWED, fiveDaysSeconds)
    }),

  deletePost: moderatorProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ input }) => {
      const candidate = await prisma.post.findUnique({
        where: { id: input.id }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const post = await prisma.post.delete({
        where: { id: input.id }
      })

      return post
    })
})
