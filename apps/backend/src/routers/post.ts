import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { myPostRouter } from './post/my'
import { moderatorPostRouter } from './post/moderator'
import { publicPostRouter } from './post/public'
import { createPostFolder } from '@backend/helpers/createPostFolder'

export const postRouter = router({
  public: publicPostRouter,
  moderator: moderatorPostRouter,
  my: myPostRouter,

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

        return { isLiked: false }
      }

      await ctx.prisma.like.create({
        data: {
          userId: ctx.user.id,
          postId: input.id
        }
      })

      return { isLiked: true }
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
