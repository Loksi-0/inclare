import { ALGORITHM_DEFAULTS, REDIS_KEYS } from '@/constants'
import type { RedisClientType } from 'redis'

export const initRedisConfig = async (redis: RedisClientType) => {
  try {
    console.log('[REDIS] Initializing default config values...')

    await Promise.all([
      redis.hSetNX(
        REDIS_KEYS.CONFIG.ALGORITHM,
        'k_coefficient',
        ALGORITHM_DEFAULTS.K
      ),
      redis.hSetNX(
        REDIS_KEYS.CONFIG.ALGORITHM,
        'gravity',
        ALGORITHM_DEFAULTS.GRAVITY
      ),
      redis.hSetNX(
        REDIS_KEYS.CONFIG.ALGORITHM,
        'past_interval',
        ALGORITHM_DEFAULTS.PAST_INTERVAL
      ),
      redis.hSetNX(
        REDIS_KEYS.CONFIG.ALGORITHM,
        'now_interval',
        ALGORITHM_DEFAULTS.NOW_INTERVAL
      )
    ])

    console.log('[REDIS] Config initialized successfully')
  } catch (e) {
    console.error('[REDIS ERROR] Initializing error:', e)
  }
}
