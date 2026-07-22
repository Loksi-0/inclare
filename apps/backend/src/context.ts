import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import getEnv from '@backend/helpers/getEnv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@db/client'
import type { Context as HonoContext } from 'hono'
import { getTokenCookie } from './helpers/tokenCookie'
import { getDeviceIdCookie } from './helpers/deviceIdCookie'
import { createClient as redisClient, type RedisClientType } from 'redis'
import { initRedisConfig } from './scripts/initRedisConfig'

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getEnv('DATABASE_URL')
  })
})

export const redis: RedisClientType = await redisClient({
  url: getEnv('REDIS_URL') || 'redis://localhost:6379'
}).connect()

await initRedisConfig(redis)

export const createContext = (
  opts: FetchCreateContextFnOptions,
  c: HonoContext
) => {
  const token = getTokenCookie(c)
  const deviceId = getDeviceIdCookie(c)

  return {
    prisma,
    redis,
    deviceId,
    token,
    honoContext: c
  }
}

export type Context = ReturnType<typeof createContext>
