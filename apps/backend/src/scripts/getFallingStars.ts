import { prisma } from '@/context'
import getEnv from '@/helpers/getEnv'
import { starsEmitter } from '@/helpers/starsEmitter'

const getFallingStars = async () => {
  const MIN_AVG_VELOCITY = 0.1
  const K = Math.max(Number(getEnv('FALLING_STAR_COEFFICIENT')), 1.1)

  const PAST_INTERVAL = 12
  const NOW_INTERVAL = 6

  const activePosts: { count: number }[] = await prisma.$queryRaw`
    SELECT COUNT(*)::int as count FROM "posts" p
    INNER JOIN "users" u ON p.author_id = u.id
    WHERE p.is_drafted = FALSE
      AND u.is_banned = FALSE
      AND u.is_private = FALSE
      AND p.created_at >= timezone('utc', NOW()) - INTERVAL '5 days'
  `
  const activePostsCount = activePosts[0]?.count || 0

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
      ORDER BY RANDOM()
      LIMIT 1;
    `

  if (stars[0]) {
    starsEmitter.emit('falling-star', stars[0].id)
  }
}

setInterval(() => {
  void getFallingStars()
}, 30000)
