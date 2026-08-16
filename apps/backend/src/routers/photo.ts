import { savePhoto } from '@backend/helpers/savePhoto'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { router } from '@backend/trpc'
import { PhotoSchema } from '@repo/validators'
import fs from 'fs/promises'

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

      const { id, optimizedUrl, rawUrl, optimizedPath, rawPath, exif } =
        await savePhoto({
          file: data.file,
          userId: ctx.user.id,
          postId: data.postId
        })

      try {
        const photo = await ctx.prisma.photo.create({
          data: {
            id,
            optimizedUrl,
            rawUrl,
            order: data.order,
            postId: data.postId,
            ...exif
          }
        })

        return photo
      } catch (e) {
        await fs.unlink(optimizedPath)
        await fs.unlink(rawPath)

        throw e
      }
    })
})
