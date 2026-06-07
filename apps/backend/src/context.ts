import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import getEnv from '@/helpers/getEnv.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@db'
import type { Context as HonoContext } from 'hono'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getEnv('DATABASE_URL')
  })
})

export const createContext = (
  opts: FetchCreateContextFnOptions,
  c: HonoContext
) => {
  return {
    prisma
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
