import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PhotoSchema } from '@repo/validators'
import { photoService } from './photo.service'

export const photoRouter = router({
  upload: protectedProcedure
    .input(PhotoSchema.upload)
    .mutation(async ({ ctx, input }) => {
      const file = input.get('file')
      const postId = input.get('postId')
      const order = input.get('order')

      const data = PhotoSchema.uploadContents.parse({
        file,
        postId,
        order
      })

      const photo = await photoService.upload({ ...data, userId: ctx.user.id })

      return photo
    })
})
