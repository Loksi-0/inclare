import apiError from '@/helpers/apiError'
import { protectedProcedure } from '@/procedures/protected.procedure'
import { router } from '@/trpc'
import { PostSchema } from '@/validators'
import { ERROR_CODES } from '@repo/api-error-codes'

export const myPostRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id
      },
      include: {
        photos: true,
        _count: {
          select: { likes: true }
        }
      }
    })

    return posts
  }),

  getOne: protectedProcedure
    .input(PostSchema.getOne)
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
          authorId: ctx.user.id
        },
        include: {
          photos: true,
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

  getPublished: protectedProcedure.query(async ({ ctx }) => {
    const uploaded = ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id,
        isDrafted: false
      },
      include: {
        photos: true,
        _count: {
          select: { likes: true }
        }
      }
    })

    return uploaded
  }),

  getDrafted: protectedProcedure.query(async ({ ctx }) => {
    const uploaded = ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id,
        isDrafted: true
      },
      include: {
        photos: true,
        _count: {
          select: { likes: true }
        }
      }
    })

    return uploaded
  }),

  toggleIsDrafted: protectedProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ ctx, input }) => {
      const candidate = await ctx.prisma.post.findUnique({
        where: {
          authorId: ctx.user.id,
          id: input.id
        }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const post = await ctx.prisma.post.update({
        where: { id: candidate.id },
        data: {
          isDrafted: !candidate.isDrafted
        }
      })

      return post
    }),

  delete: protectedProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ ctx, input }) => {
      const candidate = await ctx.prisma.post.findUnique({
        where: {
          authorId: ctx.user.id,
          id: input.id
        }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const post = await ctx.prisma.post.delete({
        where: {
          authorId: ctx.user.id,
          id: input.id
        }
      })

      return post
    })
})
