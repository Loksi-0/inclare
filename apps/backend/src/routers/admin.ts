import { ALGORITHM_DEFAULTS, REDIS_KEYS } from '@backend/constants'
import apiError from '@backend/helpers/apiError'
import { adminProcedure } from '@backend/procedures/admin.procedure'
import { router } from '@backend/trpc'
import { AdminSchema, UserSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { starsEmitter } from '@backend/helpers/starsEmitter'

export const adminRouter = router({
  getModerators: adminProcedure.query(async ({ ctx }) => {
    const moderators = await ctx.prisma.user.findMany({
      where: { role: 'MODERATOR' },
      omit: { password: true }
    })

    return moderators
  }),

  getModerator: adminProcedure
    .input(UserSchema.getOne)
    .query(async ({ ctx, input }) => {
      const moderator = await ctx.prisma.user.findUnique({
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
    .mutation(async ({ ctx, input }) => {
      const candidate = await ctx.prisma.user.findUnique({
        where: { id: input.id }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.USER.NOT_FOUND)
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          role: input.isModerator ? 'MODERATOR' : 'USER'
        }
      })

      return user
    }),

  spawnFallingStar: adminProcedure.mutation(async ({ ctx }) => {
    const post = await ctx.prisma.post.findFirst({
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

    starsEmitter.emit('falling-star', post.id)
  }),

  setAlgorithmGravity: adminProcedure
    .input(AdminSchema.setGravity)
    .mutation(async ({ ctx, input }) => {
      const newGravity = input.gravity

      if (newGravity < 1) {
        return apiError(ERROR_CODES.CONFIG.WRONG_GRAVITY)
      }

      await ctx.redis.hSet(REDIS_KEYS.CONFIG.ALGORITHM, 'gravity', newGravity)

      return newGravity
    }),

  setFallingStarCoefficient: adminProcedure
    .input(AdminSchema.setFallingStarK)
    .mutation(async ({ ctx, input }) => {
      const newK = input.K

      if (newK < 1.1) {
        return apiError(ERROR_CODES.CONFIG.WRONG_FALLING_STAR_K)
      }

      await ctx.redis.hSet(REDIS_KEYS.CONFIG.ALGORITHM, 'k_coefficient', newK)

      return newK
    }),

  setFallingStarIntervals: adminProcedure
    .input(AdminSchema.setFallingStarIntervals)
    .mutation(async ({ ctx, input }) => {
      const prevPast = await ctx.redis.hGet(
        REDIS_KEYS.CONFIG.ALGORITHM,
        'past_interval'
      )
      const prevNow = await ctx.redis.hGet(
        REDIS_KEYS.CONFIG.ALGORITHM,
        'now_interval'
      )

      const numberPrevPast = prevPast ? Number(prevPast) : null
      const numberPrevNow = prevNow ? Number(prevNow) : null

      if (
        (numberPrevPast && input.now && numberPrevPast < input.now) ||
        (numberPrevNow && input.past && numberPrevNow > input.past)
      ) {
        return apiError(ERROR_CODES.CONFIG.WRONG_INTERVALS)
      }

      if (input.past) {
        await ctx.redis.hSet(
          REDIS_KEYS.CONFIG.ALGORITHM,
          'past_interval',
          input.past
        )
      }
      if (input.now) {
        await ctx.redis.hSet(
          REDIS_KEYS.CONFIG.ALGORITHM,
          'now_interval',
          input.now
        )
      }

      return {
        past: input.past || numberPrevPast,
        now: input.now || numberPrevNow
      }
    }),

  getConfig: adminProcedure.query(async ({ ctx }) => {
    const config = await ctx.redis.hGetAll(REDIS_KEYS.CONFIG.ALGORITHM)

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
  })
})
