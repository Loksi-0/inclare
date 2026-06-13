import { OPTIMIZED_POST, RAW_POST, TEMP_POST } from '@/constants'
import fs from 'fs/promises'

type Options = {
  userId: string
  postId: string
}

export const createPostFolder = async ({ userId, postId }: Options) => {
  const rawPath = RAW_POST.PATH(userId, postId)
  const optimizedPath = OPTIMIZED_POST.PATH(userId, postId)
  const tempPath = TEMP_POST.PATH(userId, postId)

  await fs.mkdir(rawPath, { recursive: true })
  await fs.mkdir(optimizedPath, { recursive: true })
  await fs.mkdir(tempPath, { recursive: true })
}
