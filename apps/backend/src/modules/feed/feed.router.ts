import { REDIS_KEYS } from '@backend/constants'
import { feedEmitter, type FeedEmitterMap } from './feed.emitter'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import { publicProcedure, router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { on } from 'events'
import { feedService } from './feed.service'

export const feedRouter = router({
  getFeed: hybridProcedure
    .input(PostSchema.getFeed)
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id
      const redisKey = userId ? REDIS_KEYS.USER.VIEWED(userId) : null
      const limit = input?.limit || 20

      const posts = await feedService.getFeed({ userId, redisKey, limit })

      return posts
    }),

  fallingStar: publicProcedure.subscription(async function* ({ signal }) {
    const eventStream = on(feedEmitter, 'falling-star', { signal })

    for await (const [data] of eventStream) {
      const star = data as FeedEmitterMap['falling-star'][0]

      yield star
    }
  })
})
