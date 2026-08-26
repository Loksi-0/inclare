import { getPreviewUrl } from '@backend/helpers/getPreviewUrl'

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
  isLiked?: boolean
}

export const optimizedPostsDto = (posts: Post[]) => {
  const postsDto = posts.map((p) => ({
    id: p.id,
    description: p.description,
    likesCount: p._count.likes,
    previewUrl: getPreviewUrl(p.photos),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    pcs: p.photos.length,
    isLiked: p.isLiked,
    primaryColor: p.primaryColor
  }))

  return postsDto
}
