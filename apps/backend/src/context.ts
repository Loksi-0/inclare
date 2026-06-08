import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import getEnv from '@/helpers/getEnv.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@db'
import type { Context as HonoContext } from 'hono'
import { getTokenCookie } from './helpers/tokenCookie.js'
import { getDeviceIdCookie } from './helpers/deviceIdCookie.js'

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getEnv('DATABASE_URL')
  })
})

export const createContext = (
  opts: FetchCreateContextFnOptions,
  c: HonoContext
) => {
  const token = getTokenCookie(c)
  const deviceId = getDeviceIdCookie(c)

  return {
    prisma,
    deviceId,
    token,
    honoContext: c
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
