import { ALGORITHM_DEFAULTS, REDIS_KEYS } from '@backend/constants'
import { prisma, redis } from '@backend/context'
import { starsEmitter } from '@backend/helpers/starsEmitter'
import { Prisma } from '@repo/db'

const getFallingStars = async () => {
  const MIN_AVG_VELOCITY = 0.1
  const K = parseFloat(
    (await redis.hGet(REDIS_KEYS.CONFIG.ALGORITHM, 'k_coefficient')) ||
      ALGORITHM_DEFAULTS.K
  )

  const PAST_INTERVAL = Number(
    (await redis.hGet(REDIS_KEYS.CONFIG.ALGORITHM, 'past_interval')) ||
      ALGORITHM_DEFAULTS.PAST_INTERVAL
  )
  const NOW_INTERVAL = Number(
    (await redis.hGet(REDIS_KEYS.CONFIG.ALGORITHM, 'now_interval')) ||
      ALGORITHM_DEFAULTS.NOW_INTERVAL
  )

  const NOW_TIMESTAMP = Math.floor(Date.now() / 1000)

  await redis.zRemRangeByScore(
    REDIS_KEYS.STARS.VIEWED,
    0,
    NOW_TIMESTAMP - 60 * 60 * PAST_INTERVAL
  )

  const viewedStars = await redis.zRange(REDIS_KEYS.STARS.VIEWED, 0, -1)
  const viewedStarsIds = viewedStars.length > 0 ? viewedStars : ['__NONE__']

  const activePosts: { count: number }[] = await prisma.$queryRaw`
    SELECT COUNT(*)::int as count FROM "posts" p
    INNER JOIN "users" u ON p.author_id = u.id
    WHERE p.is_drafted = FALSE
      AND u.is_banned = FALSE
      AND u.is_private = FALSE
      AND p.created_at >= timezone('utc', NOW()) - INTERVAL '5 days'
  `
  const activePostsCount = activePosts.at(0)?.count || 0

  const stars: { id: string }[] = await prisma.$queryRaw`
      WITH time_helper AS (
        SELECT timezone('utc', NOW()) as utc_now
      ),

      global_metrics AS (
        SELECT
          COALESCE(
            COUNT(
              CASE WHEN l.created_at >= th.utc_now - ${PAST_INTERVAL} * INTERVAL '1 hours'
              AND l.created_at < th.utc_now - ${NOW_INTERVAL} * INTERVAL '1 hours' THEN 1 END
            )::float
            / NULLIF(${activePostsCount}, 0),
            ${MIN_AVG_VELOCITY}
          ) as v_avg_past,

          COALESCE(
            COUNT(CASE WHEN l.created_at >= th.utc_now - ${NOW_INTERVAL} * INTERVAL '1 hours' THEN 1 END)::float
            / NULLIF(${activePostsCount}, 0),
            ${MIN_AVG_VELOCITY}
          ) as v_avg_now
        FROM "likes" l
        CROSS JOIN time_helper th
      ),

      post_metrics AS (
        SELECT
          l.post_id,

          COUNT(
            CASE WHEN l.created_at >= th.utc_now - ${PAST_INTERVAL} * INTERVAL '1 hours'
            AND l.created_at < th.utc_now - ${NOW_INTERVAL} * INTERVAL '1 hours' THEN 1 END
          )::float as v_past,
          COUNT(CASE WHEN l.created_at >= th.utc_now - ${NOW_INTERVAL} * INTERVAL '1 hours' THEN 1 END)::float as v_now

        FROM "likes" l
        INNER JOIN "posts" p ON l.post_id = p.id
        INNER JOIN "users" u ON l.user_id = u.id
        CROSS JOIN time_helper th
        WHERE
          p.is_drafted = FALSE
          AND u.is_banned = FALSE
          AND u.is_private = FALSE
          AND p.created_at >= th.utc_now - INTERVAL '5 days'
        GROUP BY l.post_id
      )

      SELECT pm.post_id as id
      FROM post_metrics pm
      CROSS JOIN global_metrics gm
      WHERE
        pm.v_past > (gm.v_avg_past * ${K})
        AND pm.v_now <= gm.v_avg_now - (gm.v_avg_now / ${K})
        AND pm.post_id NOT IN (${Prisma.join(viewedStarsIds)})
      ORDER BY RANDOM()
      LIMIT 1;
    `

  const starId = stars.at(0)?.id

  if (starId) {
    await redis.zAdd(REDIS_KEYS.STARS.VIEWED, [
      { score: NOW_TIMESTAMP, value: starId }
    ])

    starsEmitter.emit('falling-star', starId)
  }
}

setInterval(() => {
  void getFallingStars()
}, 30000)
