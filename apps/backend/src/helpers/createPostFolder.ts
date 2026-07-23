import { OPTIMIZED_POST, RAW_POST, TEMP_POST } from '@backend/constants'
import { createFolder } from './createFolder'

type Options = {
  userId: string
  postId: string
}

export const createPostFolder = async ({ userId, postId }: Options) => {
  await createFolder(
    RAW_POST.PATH(userId, postId),
    OPTIMIZED_POST.PATH(userId, postId),
    TEMP_POST.PATH(userId, postId)
  )
}
