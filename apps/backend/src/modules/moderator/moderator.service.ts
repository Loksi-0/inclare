import { REDIS_KEYS } from '@backend/constants'
import { prisma, redis } from '@backend/context'
import apiError from '@backend/shared/apiError'
import { getPreviewUrl } from '@backend/shared/getPreviewUrl'
import { ERROR_CODES } from '@repo/api-error-codes'

type ModeratorInput = {
  setFallingStarIntervals: { now?: number; past?: number }
}

export const moderatorService = {
  setFallingStarIntervals: async (
    input: ModeratorInput['setFallingStarIntervals']
  ) => {
    const prevPast = await redis.hGet(
      REDIS_KEYS.CONFIG.ALGORITHM,
      'past_interval'
    )
    const prevNow = await redis.hGet(
      REDIS_KEYS.CONFIG.ALGORITHM,
      'now_interval'
    )

    const numberPrevPast = prevPast ? Number(prevPast) : null
    const numberPrevNow = prevNow ? Number(prevNow) : null

    if (
      (numberPrevPast && input.now && numberPrevPast < input.now) ||
      (numberPrevNow && input.past && numberPrevNow > input.past)
    ) {
      return apiError(ERROR_CODES.CONFIG.WRONG_INTERVALS)
    }

    if (input.past) {
      await redis.hSet(REDIS_KEYS.CONFIG.ALGORITHM, 'past_interval', input.past)
    }
    if (input.now) {
      await redis.hSet(REDIS_KEYS.CONFIG.ALGORITHM, 'now_interval', input.now)
    }

    return {
      past: input.past || numberPrevPast,
      now: input.now || numberPrevNow
    }
  },

  getModeratingPosts: async () => {
    const viewedIds = await redis.sMembers(REDIS_KEYS.MODERATOR.VIEWED)

    const fiveDaysMs = 1000 * 60 * 60 * 24 * 5
    const now = Date.now()
    const fiveDaysAgo = new Date(now - fiveDaysMs)

    const moderatingPosts = await prisma.post.findMany({
      where: {
        id: {
          notIn: viewedIds
        },
        isDrafted: false,
        author: {
          isBanned: false,
          isPrivate: false
        },
        createdAt: {
          gte: fiveDaysAgo
        }
      },
      include: {
        author: {
          omit: { password: true }
        },
        photos: {
          select: {
            order: true,
            optimizedUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const postsDto = moderatingPosts.map((p) => ({
      ...p,
      previewUrl: getPreviewUrl(p.photos)
    }))

    return postsDto
  }
}
