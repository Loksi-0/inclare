import { prisma } from '@backend/context'
import apiError from '@backend/shared/apiError'
import { getPreviewUrl } from '@backend/shared/getPreviewUrl'
import { ERROR_CODES } from '@repo/api-error-codes'
import type { PostFindUniqueArgs, PostWhereUniqueInput, Role } from '@repo/db'
import { photoUtils } from '../photo/photo.utils'
import { buildArchive } from '@backend/shared/buildArchive'
import { RAW_POST } from '@backend/constants'
import { uploadsUtils } from '../uploads/uploads.utils'

type PostInput = {
  getUserPublishedPosts: { userId: string }
  getOne: { postId: string; userId?: string; role?: Role }
  toggleLike: { userId: string; postId: string }
  toggleIsDrafted: { userId: string; postId: string }
}

export const postService = {
  getUserPublishedPosts: async (input: PostInput['getUserPublishedPosts']) => {
    const posts = await prisma.post.findMany({
      where: {
        isDrafted: false,
        author: {
          isPrivate: false,
          isBanned: false
        },
        authorId: input.userId
      },
      include: {
        photos: {
          select: {
            optimizedUrl: true,
            order: true
          }
        }
      }
    })

    const postsDto = posts.map((p) => ({
      id: p.id,
      previewUrl: getPreviewUrl(p.photos),
      createdAt: p.createdAt,
      pcs: p.photos.length
    }))

    return postsDto
  },

  getOne: async (input: PostInput['getOne']) => {
    const generalWhere: PostWhereUniqueInput = {
      id: input.postId
    }

    const filters: Record<Role | 'MY', PostFindUniqueArgs> = {
      USER: {
        where: {
          ...generalWhere,
          isDrafted: false,
          author: {
            isPrivate: false,
            isBanned: false
          }
        }
      },
      MY: { where: generalWhere },
      MODERATOR: { where: generalWhere },
      ADMIN: { where: generalWhere }
    }

    const authorPost = await prisma.post.findUnique({
      where: { id: input.postId, authorId: input.userId || 'NONE' }
    })
    const post = await prisma.post.findUnique({
      ...filters[authorPost ? 'MY' : input.role || 'USER'],
      include: {
        author: {
          omit: { password: true }
        },
        photos: true,
        _count: {
          select: { likes: true }
        },
        likes: input.userId
          ? {
              where: { userId: input.userId },
              select: { id: true }
            }
          : false
      }
    })

    if (!post) {
      return apiError(ERROR_CODES.POST.NOT_FOUND)
    }

    const sortedPhotos = [...post.photos].sort((a, b) => a.order - b.order)

    const postDto = {
      ...post,
      photos: sortedPhotos,
      likesCount: post._count.likes,
      isLiked: input.userId ? post.likes.length > 0 : false,
      isMy: Boolean(authorPost)
    }

    return postDto
  },

  toggleLike: async (input: PostInput['toggleLike']) => {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: input.userId,
          postId: input.postId
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: input.userId,
            postId: input.postId
          }
        }
      })
    } else {
      await prisma.like.create({
        data: {
          userId: input.userId,
          postId: input.postId
        }
      })
    }

    const postData = await prisma.post.findUnique({
      where: { id: input.postId },
      select: {
        _count: {
          select: {
            likes: true
          }
        }
      }
    })

    if (!postData) {
      return apiError(ERROR_CODES.POST.NOT_FOUND)
    }

    return { isLiked: !existingLike, likesCount: postData._count.likes }
  },

  toggleIsDrafted: async (input: PostInput['toggleIsDrafted']) => {
    const candidate = await prisma.post.findUnique({
      where: {
        id: input.postId,
        authorId: input.userId
      },
      include: {
        photos: {
          select: {
            order: true,
            optimizedUrl: true
          }
        }
      }
    })

    if (!candidate) {
      return apiError(ERROR_CODES.POST.NOT_FOUND)
    }

    const rawArchive = candidate.isDrafted
      ? await buildArchive(
          RAW_POST.PATH(candidate.authorId, candidate.id),
          RAW_POST.URL(candidate.authorId, candidate.id)
        )
      : undefined

    const firstPhotoUrl = getPreviewUrl(candidate.photos)
    const primaryColor =
      candidate.isDrafted && firstPhotoUrl
        ? await photoUtils.getPrimaryColor(
            uploadsUtils.getFilePathByUrl(firstPhotoUrl)
          )
        : undefined

    const post = await prisma.post.update({
      where: { id: candidate.id },
      data: candidate.isDrafted
        ? {
            isDrafted: !candidate.isDrafted,
            rawArchiveUrl: rawArchive?.url,
            primaryColor
          }
        : { isDrafted: !candidate.isDrafted }
    })

    return post
  }
}
