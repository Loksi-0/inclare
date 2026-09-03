import { prisma } from '@backend/context'
import type { PhotoSchema } from '@repo/validators'
import fs from 'fs/promises'
import { savePhoto } from './photo.save'

type PhotoInput = {
  upload: PhotoSchema.UploadContents & { userId: string }
}

export const photoService = {
  upload: async (data: PhotoInput['upload']) => {
    const { id, optimizedUrl, rawUrl, optimizedPath, rawPath, exif } =
      await savePhoto({
        file: data.file,
        userId: data.userId,
        postId: data.postId
      })

    try {
      const photo = await prisma.photo.create({
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
  }
}
