import apiError from '@backend/helpers/apiError'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { optimizedPostsDto } from '@backend/dtos/postsDto'

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

    return optimizedPostsDto(posts)
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
    const uploaded = await ctx.prisma.post.findMany({
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

    return optimizedPostsDto(uploaded)
  }),

  getDrafted: protectedProcedure.query(async ({ ctx }) => {
    const drafted = await ctx.prisma.post.findMany({
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

    return optimizedPostsDto(drafted)
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
