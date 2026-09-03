import apiError from '@backend/shared/apiError'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import { POST } from '@backend/constants'
import fs from 'fs/promises'
import { getPreviewUrl } from '@backend/shared/getPreviewUrl'
import { prisma } from '@backend/context'
import { postService } from './post.service'

export const myPostRouter = router({
  getPublished: protectedProcedure.query(async ({ ctx }) => {
    const published = await prisma.post.findMany({
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
    const drafted = await prisma.post.findMany({
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
    const drafted = await prisma.post.findMany({
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
      const post = await postService.toggleIsDrafted({
        userId: ctx.user.id,
        postId: input.id
      })

      return post
    }),

  setDescription: protectedProcedure
    .input(PostSchema.setDescription)
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: input.id,
          authorId: ctx.user.id
        }
      })

      if (!post) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const updatedPost = await prisma.post.update({
        where: { id: input.id },
        data: { description: input.description }
      })

      return updatedPost
    }),

  delete: protectedProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ ctx, input }) => {
      const candidate = await prisma.post.findUnique({
        where: {
          authorId: ctx.user.id,
          id: input.id
        }
      })

      if (!candidate) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const post = await prisma.post.delete({
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
