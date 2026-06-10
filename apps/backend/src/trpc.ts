import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import SuperJSON from 'superjson'

export const t = initTRPC.context<Context>().create({ transformer: SuperJSON })

export const publicProcedure = t.procedure
export const router = t.router
