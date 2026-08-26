import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { myPostRouter } from './post/my'
import { moderatorPostRouter } from './post/moderator'
import { publicPostRouter } from './post/public'
import { createPostFolder } from '@backend/helpers/createPostFolder'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import type { User } from '@db/client'
import type {
  PostFindManyArgs,
  PostFindUniqueArgs,
  PostWhereInput,
  PostWhereUniqueInput
} from '@db/models'
import apiError from '@backend/helpers/apiError'
import { ERROR_CODES } from '@repo/api-error-codes'
import { getPreviewUrl } from '@backend/helpers/getPreviewUrl'

export const postRouter = router({
  public: publicPostRouter,
  moderator: moderatorPostRouter,
  my: myPostRouter,

  getUserPosts: hybridProcedure
    .input(PostSchema.getUsers)
    .query(async ({ ctx, input }) => {
      const generalWhere: PostWhereInput = {
        authorId: input.userId
      }

      const filters: Record<User['role'], PostFindManyArgs> = {
        USER: {
          where: {
            ...generalWhere,
            isDrafted: false,
            author: {
              isPrivate: false,
              isBanned: false
            }
          }
        },
        MODERATOR: { where: generalWhere },
        ADMIN: { where: generalWhere }
      }

      const posts = await ctx.prisma.post.findMany({
        ...filters[ctx.user?.role || 'USER'],
        include: {
          photos: {
            select: {
              optimizedUrl: true,
              order: true
            }
          }
        }
      })

      const postsDto = posts.map((p) => ({
        id: p.id,
        previewUrl: getPreviewUrl(p.photos),
        createdAt: p.createdAt,
        pcs: p.photos.length
      }))

      return postsDto
    }),

  getOne: hybridProcedure
    .input(PostSchema.getOne)
    .query(async ({ ctx, input }) => {
      const generalWhere: PostWhereUniqueInput = {
        id: input.id
      }

      const filters: Record<User['role'] | 'MY', PostFindUniqueArgs> = {
        USER: {
          where: {
            ...generalWhere,
            isDrafted: false,
            author: {
              isPrivate: false,
              isBanned: false
            }
          }
        },
        MY: { where: generalWhere },
        MODERATOR: { where: generalWhere },
        ADMIN: { where: generalWhere }
      }

      const authorPost = await ctx.prisma.post.findUnique({
        where: { id: input.id, authorId: ctx.user?.id || 'NONE' }
      })
      const post = await ctx.prisma.post.findUnique({
        ...filters[authorPost ? 'MY' : ctx.user?.role || 'USER'],
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
                where: { userId: ctx.user.id },
                select: { id: true }
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
        isLiked: ctx.user?.id ? post.likes.length > 0 : false,
        isMy: Boolean(authorPost)
      }

      return postDto
    }),

  toggleLike: protectedProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: ctx.user.id,
            postId: input.id
          }
        }
      })

      if (existingLike) {
        await ctx.prisma.like.delete({
          where: {
            userId_postId: {
              userId: ctx.user.id,
              postId: input.id
            }
          }
        })
      } else {
        await ctx.prisma.like.create({
          data: {
            userId: ctx.user.id,
            postId: input.id
          }
        })
      }

      const postData = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        select: {
          _count: {
            select: {
              likes: true
            }
          }
        }
      })

      if (!postData) {
        return apiError(ERROR_CODES.POST.NOT_FOUND)
      }

      return { isLiked: !existingLike, likesCount: postData._count.likes }
    }),

  create: protectedProcedure
    .input(PostSchema.create)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          authorId: ctx.user.id,
          description: input.description
        }
      })

      await createPostFolder({ userId: post.authorId, postId: post.id })

      return post
    })
})
