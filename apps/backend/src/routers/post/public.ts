import apiError from '@/helpers/apiError'
import { hybridProcedure } from '@/procedures/hybrid.procedure'
import { PostService } from '@/services/post.service'
import { router } from '@/trpc'
import { PostSchema } from '@/validators'
import { ERROR_CODES } from '@repo/api-error-codes'

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
      const redisKey = userId ? `user:${userId}:viewed` : null
      const limit = input.limit || 20

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
    })
})
