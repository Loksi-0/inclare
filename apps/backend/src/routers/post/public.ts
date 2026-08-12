import { REDIS_KEYS } from '@backend/constants'
import {
  starsEmitter,
  type StarsEmitterMap
} from '@backend/helpers/starsEmitter'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import { PostService } from '@backend/services/post.service'
import { publicProcedure, router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { on } from 'events'
import { optimizedPostsDto } from '@backend/dtos/postsDto'

export const publicPostRouter = router({
  getAll: hybridProcedure.query(async ({ ctx }) => {
    const posts = await PostService.find({ userId: ctx.user?.id })

    return posts
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

      return optimizedPostsDto(posts)
    }),

  fallingStar: publicProcedure.subscription(async function* ({ signal }) {
    const eventStream = on(starsEmitter, 'falling-star', { signal })

    for await (const [data] of eventStream) {
      const star = data as StarsEmitterMap['falling-star'][0]

      yield star
    }
  })
})
