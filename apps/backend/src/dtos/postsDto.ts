type Post = {
  id: string
  description: string | null
  _count: {
    likes: number
  }
  photos: { optimizedUrl: string }[]
  createdAt: Date
  updatedAt: Date
  isLiked?: boolean
}

export const optimizedPostsDto = (posts: Post[]) => {
  const postsDto = posts.map((p) => ({
    id: p.id,
    description: p.description,
    likesCount: p._count.likes,
    previewUrl: p.photos.at(0)?.optimizedUrl,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    pcs: p.photos.length,
    isLiked: p.isLiked
  }))

  return postsDto
}
