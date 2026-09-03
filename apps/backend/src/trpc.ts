import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import SuperJSON from 'superjson'
import getEnv from './shared/getEnv'

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape }) => {
    return {
      message: shape.message,
      code: shape.code,
      data: {
        code: shape.data.code,
        httpStatus: shape.data.httpStatus,
        stack:
          getEnv('NODE_ENV') !== 'development' ? undefined : shape.data.stack
      }
    }
  }
})

export const publicProcedure = t.procedure
export const router = t.router
