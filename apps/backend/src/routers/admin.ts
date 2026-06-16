import { REDIS_KEYS } from '@/constants'
import apiError from '@/helpers/apiError'
import getEnv from '@/helpers/getEnv'
import { adminProcedure } from '@/procedures/admin.procedure'
import { router } from '@/trpc'
import { AdminSchema, UserSchema } from '@/validators'
import { ERROR_CODES } from '@repo/api-error-codes'

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

  setAlgorithmGravity: adminProcedure
    .input(AdminSchema.setGravity)
    .mutation(async ({ ctx, input }) => {
      const newGravity =
        input.gravity >= 1 ? input.gravity : Number(getEnv('ALGORITHM_GRAVITY'))

      await ctx.redis.set(REDIS_KEYS.CONFIG.GRAVITY, newGravity)

      return newGravity
    }),

  setFallingStarCoefficient: adminProcedure
    .input(AdminSchema.setFallingStarK)
    .mutation(async ({ ctx, input }) => {
      const newK =
        input.K >= 1.1 ? input.K : Number(getEnv('FALLING_STAR_COEFFICIENT'))

      await ctx.redis.set(REDIS_KEYS.CONFIG.FALLING_STAR.K, newK)

      return newK
    }),

  setFallingStarIntervals: adminProcedure
    .input(AdminSchema.setFallingStarIntervals)
    .mutation(async ({ ctx, input }) => {
      const prevPast = await ctx.redis.get(
        REDIS_KEYS.CONFIG.FALLING_STAR.PAST_INTERVAL
      )
      const prevNow = await ctx.redis.get(
        REDIS_KEYS.CONFIG.FALLING_STAR.NOW_INTERVAL
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
        await ctx.redis.set(
          REDIS_KEYS.CONFIG.FALLING_STAR.PAST_INTERVAL,
          input.past
        )
      }
      if (input.now) {
        await ctx.redis.set(
          REDIS_KEYS.CONFIG.FALLING_STAR.NOW_INTERVAL,
          input.now
        )
      }

      return {
        past: input.past || numberPrevPast,
        now: input.now || numberPrevNow
      }
    }),

  getConfig: adminProcedure.query(async ({ ctx }) => {
    const K = await ctx.redis.get(REDIS_KEYS.CONFIG.FALLING_STAR.K)
    const gravity = await ctx.redis.get(REDIS_KEYS.CONFIG.GRAVITY)
    const pastInterval = await ctx.redis.get(
      REDIS_KEYS.CONFIG.FALLING_STAR.PAST_INTERVAL
    )
    const nowInterval = await ctx.redis.get(
      REDIS_KEYS.CONFIG.FALLING_STAR.NOW_INTERVAL
    )

    const numberK = K ? Number(K) : null
    const numberGravity = gravity ? Number(gravity) : null
    const numberPastInterval = pastInterval ? Number(pastInterval) : null
    const numberNowInterval = nowInterval ? Number(nowInterval) : null

    return {
      fallingStarK: numberK,
      alogrithmGravity: numberGravity,
      pastInterval: numberPastInterval,
      nowInterval: numberNowInterval
    }
  })
})
