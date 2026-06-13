import apiError from '@/helpers/apiError'
import { moderatorProcedure } from '@/procedures/moderator.procedure'
import { router } from '@/trpc'
import { PostSchema } from '@/validators'
import { ERROR_CODES } from '@repo/api-error-codes'

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

  getOne: moderatorProcedure
    .input(PostSchema.getOne)
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id
        },
        include: {
          photos: true,
          author: {
            omit: { password: true }
          },
          _count: {
            select: { likes: true }
          }
        }
      })

      if (!post) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      return post
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
