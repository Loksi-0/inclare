import apiError from '@backend/helpers/apiError'
import { moderatorProcedure } from '@backend/procedures/moderator.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { REDIS_KEYS } from '@backend/constants'
import { getPreviewUrl } from '@backend/helpers/getPreviewUrl'

export const moderatorPostRouter = router({
  getAll: moderatorProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      include: {
        photos: true,
        _count: {
          select: { likes: true }
        }
      }
    })

    return posts
  }),

  getModerating: moderatorProcedure.query(async ({ ctx }) => {
    const viewedIds = await ctx.redis.sMembers(REDIS_KEYS.MODERATOR.VIEWED)

    const fiveDaysMs = 1000 * 60 * 60 * 24 * 5
    const now = Date.now()
    const fiveDaysAgo = new Date(now - fiveDaysMs)

    const moderatingPosts = await ctx.prisma.post.findMany({
      where: {
        id: {
          notIn: viewedIds
        },
        isDrafted: false,
        author: {
          isBanned: false,
          isPrivate: false
        },
        createdAt: {
          gte: fiveDaysAgo
        }
      },
      include: {
        author: {
          omit: { password: true }
        },
        photos: {
          select: {
            order: true,
            optimizedUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const postsDto = moderatingPosts.map((p) => ({
      ...p,
      previewUrl: getPreviewUrl(p.photos)
    }))

    return postsDto
  }),

  markAsViewed: moderatorProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ ctx, input }) => {
      const fiveDaysSeconds = 60 * 60 * 24 * 5

      await ctx.redis.sAdd(REDIS_KEYS.MODERATOR.VIEWED, input.id)
      await ctx.redis.expire(REDIS_KEYS.MODERATOR.VIEWED, fiveDaysSeconds)
    }),

  delete: moderatorProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ ctx, input }) => {
      const candidate = await ctx.prisma.post.findUnique({
        where: {
          id: input.id
        }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const post = await ctx.prisma.post.delete({
        where: {
          id: input.id
        }
      })

      return post
    })
})
