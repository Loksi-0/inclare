import { router } from '@backend/trpc'
import { userRouter } from './user'
import { authRouter } from './auth'
import { postRouter } from './post'
import { photoRouter } from './photo'
import { adminRouter } from './admin'

export type * from 'redis'

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  post: postRouter,
  photo: photoRouter,
  admin: adminRouter
})

export type AppRouter = typeof appRouter
