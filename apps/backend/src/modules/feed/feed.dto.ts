import { getPreviewUrl } from '@backend/shared/getPreviewUrl'
import type { Like } from '@repo/db'

type Post = {
  id: string
  description: string | null
  _count: {
    likes: number
  }
  photos: { optimizedUrl: string; order: number }[]
  createdAt: Date
  updatedAt: Date
  primaryColor: string | null
  likes?: Like[]
}

export const feedDto = (posts: Post[]) => {
  const postsDto = posts.map((p) => ({
    id: p.id,
    description: p.description,
    likesCount: p._count.likes,
    previewUrl: getPreviewUrl(p.photos),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    pcs: p.photos.length,
    isLiked: p.likes?.at(0) ? true : false,
    primaryColor: p.primaryColor
  }))

  return postsDto
}
