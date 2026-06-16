import { REDIS_KEYS } from '@/constants'
import apiError from '@/helpers/apiError'
import { starsEmitter, type StarsEmitterMap } from '@/helpers/starsEmitter'
import { hybridProcedure } from '@/procedures/hybrid.procedure'
import { PostService } from '@/services/post.service'
import { publicProcedure, router } from '@/trpc'
import { PostSchema } from '@/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { on } from 'events'

export const publicPostRouter = router({
  getAll: hybridProcedure.query(async ({ ctx }) => {
    const posts = await PostService.find({ userId: ctx.user?.id })

    return posts
  }),

  getOne: hybridProcedure
    .input(PostSchema.getOne)
    .query(async ({ ctx, input }) => {
      const post = await PostService.findUnique({
        id: input.id,
        userId: ctx.user?.id
      })

      if (!post) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      return post
    }),

  getFeed: hybridProcedure
    .input(PostSchema.getFeed)
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id
      const redisKey = userId ? REDIS_KEYS.USER.VIEWED(userId) : null
      const limit = input?.limit || 20

      const viewedIds = redisKey ? await ctx.redis.sMembers(redisKey) : []

      const recommendedIds = await PostService.getRecommendedIds({
        limit,
        viewedIds
      })

      if (recommendedIds.length > 0 && redisKey) {
        await ctx.redis.sAdd(redisKey, recommendedIds)
        await ctx.redis.expire(redisKey, 86400)
      }

      const posts = await PostService.find({ ids: recommendedIds, userId })

      return posts
    }),

  fallingStar: publicProcedure.subscription(async function* ({ signal }) {
    const eventStream = on(starsEmitter, 'falling-star', { signal })

    for await (const [data] of eventStream) {
      const star = data as StarsEmitterMap['falling-star'][0]

      yield star
    }
  })
})
