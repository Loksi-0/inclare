import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import getEnv from '@backend/shared/getEnv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@repo/db'
import type { Context as HonoContext } from 'hono'
import { createClient as redisClient, type RedisClientType } from 'redis'
import IoRedis from 'ioredis'
import { initRedisConfig } from './scripts/initRedisConfig'
import { authCookie } from './modules/auth/auth.cookie'

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getEnv('DATABASE_URL')
  })
})

export const redis: RedisClientType = await redisClient({
  url: getEnv('REDIS_URL') || 'redis://localhost:6379'
}).connect()

export const bullConnection = new IoRedis(getEnv('REDIS_URL'), {
  maxRetriesPerRequest: null
})

await initRedisConfig(redis)

export const createContext = (
  opts: FetchCreateContextFnOptions,
  c: HonoContext
) => {
  const token = authCookie.getToken(c)
  const deviceId = authCookie.getDeviceId(c)

  return {
    deviceId,
    token,
    context: c
  }
}

export type Context = ReturnType<typeof createContext>
