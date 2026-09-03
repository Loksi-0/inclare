import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PostSchema } from '@repo/validators'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import { prisma } from '@backend/context'
import { postService } from './post.service'
import { postUtils } from './post.utils'
import { myPostRouter } from './my.router'

export const postRouter = router({
  my: myPostRouter,

  getUserPublishedPosts: hybridProcedure
    .input(PostSchema.getUsers)
    .query(async ({ input }) => {
      const posts = await postService.getUserPublishedPosts(input)

      return posts
    }),

  getOne: hybridProcedure
    .input(PostSchema.getOne)
    .query(async ({ ctx, input }) => {
      const post = await postService.getOne({
        postId: input.id,
        userId: ctx.user?.id,
        role: ctx.user?.role
      })

      return post
    }),

  toggleLike: protectedProcedure
    .input(PostSchema.getOne)
    .mutation(async ({ ctx, input }) => {
      const data = await postService.toggleLike({
        userId: ctx.user.id,
        postId: input.id
      })

      return data
    }),

  create: protectedProcedure
    .input(PostSchema.create)
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.create({
        data: {
          authorId: ctx.user.id,
          description: input.description
        }
      })

      await postUtils.createPostFolder({
        userId: post.authorId,
        postId: post.id
      })

      return post
    })
})
