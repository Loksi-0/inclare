import apiError from '@/helpers/apiError'
import { hybridProcedure } from '@/procedures/hybrid.procedure'
import { router } from '@/trpc'
import { PostSchema } from '@/validators'
import { ERROR_CODES } from '@repo/api-error-codes'

export const publicPostRouter = router({
  getAll: hybridProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        isDrafted: false,
        author: {
          isPrivate: false,
          isBanned: false
        }
      },
      include: {
        photos: true,
        _count: {
          select: { likes: true }
        },
        likes: ctx.user?.id
          ? {
              where: {
                userId: ctx.user.id
              },
              select: {
                id: true
              }
            }
          : false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const postsDto = posts.map((p) => ({
      ...p,
      likesCount: p._count.likes,
      isLiked: ctx.user ? p.likes.length > 0 : false
    }))

    return postsDto
  }),

  getOne: hybridProcedure
    .input(PostSchema.getOne)
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
          isDrafted: false,
          author: {
            isPrivate: false,
            isBanned: false
          }
        },
        include: {
          author: {
            omit: { password: true }
          },
          photos: true,
          _count: {
            select: { likes: true }
          },
          likes: ctx.user?.id
            ? {
                where: {
                  userId: ctx.user.id
                },
                select: {
                  id: true
                }
              }
            : false
        }
      })

      if (!post) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      const postDto = {
        ...post,
        likesCount: post._count.likes,
        isLiked: ctx.user ? post.likes.length > 0 : false
      }

      return postDto
    })
})
