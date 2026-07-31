import { ALGORITHM_DEFAULTS, REDIS_KEYS } from '@backend/constants'
import { prisma, redis } from '@backend/context'
import { Prisma } from '@db/client'

type FindOpts = {
  ids?: string[]
  userId?: string
  options?: object
}

type FindUniqueOpts = {
  id: string
  userId?: string
  options?: object
}

type GetRecommendedIdsOpts = {
  limit: number
  viewedIds: string[]
}

export const PostService = {
  find: async (opts?: FindOpts) => {
    const { ids, userId, options } = opts || {}

    const posts = await prisma.post.findMany({
      where: {
        isDrafted: false,
        author: {
          isPrivate: false,
          isBanned: false
        },
        id: {
          in: ids
        }
      },
      include: {
        author: {
          omit: { password: true }
        },
        photos: true,
        _count: {
          select: { likes: true }
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true }
            }
          : false
      },
      ...options
    })

    const postsDto = posts.map((p) => ({
      ...p,
      likesCount: p._count.likes,
      isLiked: userId ? p.likes.length > 0 : false
    }))

    return postsDto
  },

  findUnique: async ({ id, userId, options }: FindUniqueOpts) => {
    const post = await prisma.post.findUnique({
      where: {
        isDrafted: false,
        author: {
          isPrivate: false,
          isBanned: false
        },
        id
      },
      include: {
        author: {
          omit: { password: true }
        },
        photos: true,
        _count: {
          select: { likes: true }
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true }
            }
          : false
      },
      ...options
    })

    const postDto = post
      ? {
          ...post,
          likesCount: post._count.likes,
          isLiked: userId ? post.likes.length > 0 : false
        }
      : null

    return postDto
  },

  getRecommendedIds: async ({ limit, viewedIds }: GetRecommendedIdsOpts) => {
    const trendingLimit = Math.floor(limit * 0.6)
    const newLimit = limit - trendingLimit
    viewedIds = viewedIds.length > 0 ? viewedIds : ['__NONE__']

    const GRAVITY = parseFloat(
      (await redis.hGet(REDIS_KEYS.CONFIG.ALGORITHM, 'gravity')) ||
        ALGORITHM_DEFAULTS.GRAVITY
    )

    const rawPosts: { id: string }[] = await prisma.$queryRaw`
        SELECT main.id FROM ( 
          (
            SELECT p.*,
            (COUNT(l.id) - 1) / POWER((EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600) + 2, ${GRAVITY}) as "score"
            FROM "posts" p
            LEFT JOIN "likes" l ON l.post_id = p.id
            INNER JOIN "users" u ON p.author_id = u.id
            WHERE 
              p.id NOT IN (${Prisma.join(viewedIds)}) 
              AND p.is_drafted = FALSE
              AND u.is_banned = FALSE
              AND u.is_private = FALSE
            GROUP BY p.id, p.created_at
            ORDER BY "score" DESC
            LIMIT ${trendingLimit}
          )

          UNION ALL

          (
            SELECT p.*, 0 as "score"
            FROM "posts" p
            LEFT JOIN "likes" l ON l.post_id = p.id
            INNER JOIN "users" u ON p.author_id = u.id
            WHERE 
              p.id NOT IN (${Prisma.join(viewedIds)}) 
              AND p.is_drafted = FALSE
              AND u.is_banned = FALSE
              AND u.is_private = FALSE
              AND p.created_at >= NOW() - INTERVAL '24 hours'
            GROUP BY p.id, p.created_at
            ORDER BY RANDOM()
            LIMIT ${newLimit}
          ) 
        ) as main

        ORDER BY RANDOM();
      `

    const uniqueRawPosts = Array.from(new Set(rawPosts.map((p) => p.id)))

    let posts = uniqueRawPosts
    if (uniqueRawPosts.length < limit) {
      const viewedPosts: { id: string }[] = await prisma.$queryRaw`
        SELECT p.* FROM "posts" p
        WHERE p.id IN (${Prisma.join(viewedIds)})
        ORDER BY RANDOM()
        LIMIT ${limit - uniqueRawPosts.length};
      `

      const mappedViewedPosts = viewedPosts.map((p) => p.id)

      posts = [...uniqueRawPosts, ...mappedViewedPosts]
    }

    return posts
  }
}
