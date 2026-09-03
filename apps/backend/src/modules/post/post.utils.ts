import { OPTIMIZED_POST, RAW_POST, TEMP_POST } from '@backend/constants'
import { createFolder } from '@backend/shared/createFolder'

type UtilsOptions = {
  createPostFolder: { userId: string; postId: string }
}

export const postUtils = {
  createPostFolder: async ({
    userId,
    postId
  }: UtilsOptions['createPostFolder']) => {
    await createFolder(
      RAW_POST.PATH(userId, postId),
      OPTIMIZED_POST.PATH(userId, postId),
      TEMP_POST.PATH(userId, postId)
    )
  }
}
