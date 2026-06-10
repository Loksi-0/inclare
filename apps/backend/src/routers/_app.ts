import { router } from '@/trpc'
import { userRouter } from './users'
import { authRouter } from './auth'

export type * from '@db/client'
export type { PrismaClient } from '@db/internal/class'
export type * from '@db/internal/prismaNamespace'

export const appRouter = router({
  user: userRouter,
  auth: authRouter
})

export type AppRouter = typeof appRouter
