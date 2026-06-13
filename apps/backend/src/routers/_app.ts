import { router } from '@/trpc'
import { userRouter } from './user'
import { authRouter } from './auth'
import { postRouter } from './post'
import { photoRouter } from './photo'

export type * from '@db/client'
export type { PrismaClient } from '@db/internal/class'
export type * from '@db/internal/prismaNamespace'

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  post: postRouter,
  photo: photoRouter
})

export type AppRouter = typeof appRouter
