import { ALGORITHM_DEFAULTS, REDIS_KEYS } from '@backend/constants'
import { prisma, redis } from '@backend/context'
import { Prisma } from '@repo/db'
import { feedDto } from './feed.dto'

type FeedInput = {
  getFeed: {
    limit: number
    redisKey: string | null
    userId?: string
  }
}

export const feedService = {
  getFeed: async ({ limit, redisKey, userId }: FeedInput['getFeed']) => {
    const viewedIds = redisKey ? await redis.sMembers(redisKey) : []
    const normalizedViewedIds = viewedIds.length > 0 ? viewedIds : ['__NONE__']

    const trendingLimit = Math.floor(limit * 0.6)
    const newLimit = limit - trendingLimit

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
              p.id NOT IN (${Prisma.join(normalizedViewedIds)}) 
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
              p.id NOT IN (${Prisma.join(normalizedViewedIds)}) 
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

    const uniqueIds = Array.from(new Set(rawPosts.map((p) => p.id)))

    let postIds = uniqueIds
    if (uniqueIds.length < limit) {
      const viewedPosts: { id: string }[] = await prisma.$queryRaw`
        SELECT p.* FROM "posts" p
        WHERE p.id IN (${Prisma.join(viewedIds)})
        ORDER BY RANDOM()
        LIMIT ${limit - uniqueIds.length};
      `

      const mappedViewedPosts = viewedPosts.map((p) => p.id)

      postIds = [...uniqueIds, ...mappedViewedPosts]
    }

    if (postIds.length > 0 && redisKey) {
      await redis.sAdd(redisKey, postIds)
      await redis.expire(redisKey, 86400)
    }

    const posts = await prisma.post.findMany({
      where: {
        id: { in: postIds },
        isDrafted: false,
        author: {
          isPrivate: false,
          isBanned: false
        },
        photos: {
          some: {}
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
      }
    })

    const postsDto = feedDto(posts)

    return postsDto
  }
}
