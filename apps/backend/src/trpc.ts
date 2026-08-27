import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import SuperJSON from 'superjson'

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape }) => {
    return {
      message: shape.message,
      code: shape.code,
      data: {
        code: shape.data.code,
        httpStatus: shape.data.httpStatus
      }
    }
  }
})

export const publicProcedure = t.procedure
export const router = t.router
