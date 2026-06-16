import { router } from '@/trpc'
import { userRouter } from './user'
import { authRouter } from './auth'
import { postRouter } from './post'
import { photoRouter } from './photo'
import { adminRouter } from './admin'

export type * from '@db/client'
export type { PrismaClient } from '@db/internal/class'
export type * from '@db/internal/prismaNamespace'
export type * from 'redis'

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  post: postRouter,
  photo: photoRouter,
  admin: adminRouter
})

export type AppRouter = typeof appRouter
