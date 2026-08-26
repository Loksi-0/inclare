import apiError from '@backend/helpers/apiError'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { optimizedPostsDto } from '@backend/dtos/postsDto'
import { buildArchive } from '@backend/helpers/buildArchive'
import { POST, RAW_POST } from '@backend/constants'
import fs from 'fs/promises'
import { getPrimaryColor } from '@backend/helpers/getPrimaryColor'
import { getFilePathByUrl } from '@backend/helpers/getFilePathByUrl'
import { getPreviewUrl } from '@backend/helpers/getPreviewUrl'

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
    const published = await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id,
        isDrafted: false,
        photos: {
          some: {}
        }
      },
      include: {
        photos: {
          select: { order: true, optimizedUrl: true }
        },
        _count: {
          select: { photos: true }
        }
      }
    })

    const publishedDto = published.map((p) => ({
      id: p.id,
      previewUrl: getPreviewUrl(p.photos),
      createdAt: p.createdAt,
      pcs: p._count.photos
    }))

    return publishedDto
  }),

  getDrafted: protectedProcedure.query(async ({ ctx }) => {
    const drafted = await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id,
        isDrafted: true,
        photos: {
          some: {}
        }
      },
      include: {
        photos: {
          select: { order: true, optimizedUrl: true }
        }
      }
    })

    const draftedDto = drafted.map((p) => ({
      id: p.id,
      previewUrl: getPreviewUrl(p.photos)
    }))

    return draftedDto
  }),

  getDraftedLength: protectedProcedure.query(async ({ ctx }) => {
    const drafted = await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.user.id,
        isDrafted: true,
        photos: {
          some: {}
        }
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
        },
        include: {
          photos: {
            select: {
              order: true,
              optimizedUrl: true
            }
          }
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

      const firstPhotoUrl = getPreviewUrl(candidate.photos)
      const primaryColor =
        candidate.isDrafted && firstPhotoUrl
          ? await getPrimaryColor(getFilePathByUrl(firstPhotoUrl))
          : undefined

      const post = await ctx.prisma.post.update({
        where: { id: candidate.id },
        data: candidate.isDrafted
          ? {
              isDrafted: !candidate.isDrafted,
              rawArchiveUrl: rawArchive?.url,
              primaryColor
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

      await fs.rm(POST.PATH(ctx.user.id, post.id), {
        force: true,
        recursive: true
      })

      return post
    })
})
