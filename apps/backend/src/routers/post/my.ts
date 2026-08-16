import apiError from '@backend/helpers/apiError'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { optimizedPostsDto } from '@backend/dtos/postsDto'
import { buildArchive } from '@backend/helpers/buildArchive'
import { RAW_POST } from '@backend/constants'

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

  getDraftedLength: protectedProcedure.query(async ({ ctx }) => {
    const drafted = await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id,
        isDrafted: true
      }
    })

    return drafted.length
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

      const rawArchive = candidate.isDrafted
        ? await buildArchive(
            RAW_POST.PATH(candidate.authorId, candidate.id),
            RAW_POST.URL(candidate.authorId, candidate.id)
          )
        : undefined

      const post = await ctx.prisma.post.update({
        where: { id: candidate.id },
        data: rawArchive?.url
          ? {
              isDrafted: !candidate.isDrafted,
              rawArchiveUrl: rawArchive.url
            }
          : { isDrafted: !candidate.isDrafted }
      })

      return post
    }),

  setDescription: protectedProcedure
    .input(PostSchema.setDescription)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
          authorId: ctx.user.id
        }
      })

      if (!post) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const updatedPost = await ctx.prisma.post.update({
        where: { id: input.id },
        data: { description: input.description }
      })

      return updatedPost
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
