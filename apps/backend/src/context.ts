import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import getEnv from '@/helpers/getEnv.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@db'
import type { Context as HonoContext } from 'hono'
import { getTokenCookie } from './helpers/tokenCookie.js'
import { getDeviceIdCookie } from './helpers/deviceIdCookie.js'
import { verify } from 'hono/jwt'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getEnv('DATABASE_URL')
  })
})

const getValidUserId = async (
  token: string | undefined,
  deviceId: string | undefined
) => {
  if (!token || !deviceId) {
    return null
  }

  const payload = await verify(token, getEnv('JWT_SECRET'), 'HS256')

  if (payload.userId && payload.deviceId && payload.deviceId === deviceId) {
    return payload.userId as string
  }

  return null
}

export const createContext = async (
  opts: FetchCreateContextFnOptions,
  c: HonoContext
) => {
  const token = getTokenCookie(c)
  const deviceId = getDeviceIdCookie(c)

  const userId = await getValidUserId(token, deviceId)

  return {
    prisma,
    userId,
    deviceId
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
