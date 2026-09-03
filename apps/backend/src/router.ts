import { Hono } from 'hono'
import { router } from './trpc'
import { authRouter } from './modules/auth/auth.router'
import { feedRouter } from './modules/feed/feed.router'
import { moderatorRouter } from './modules/moderator/moderator.router'
import { photoRouter } from './modules/photo/photo.router'
import { postRouter } from './modules/post/post.router'
import { userRouter } from './modules/user/user.router'
import { UPLOADS } from './constants'
import { uploads } from './modules/uploads/uploads.router'
import { API_BASE_URL } from '@repo/constants'
import { cache } from './modules/cache/cache.router'
import { rest } from './modules/rest/rest.router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from './context'

export const appRouter = new Hono()

const trpcRouter = router({
  auth: authRouter,
  user: userRouter,
  feed: feedRouter,
  moderator: moderatorRouter,
  photo: photoRouter,
  post: postRouter
})

appRouter.route(UPLOADS.URL, uploads)
appRouter.route(API_BASE_URL, cache)
appRouter.route(API_BASE_URL, rest)

appRouter.all(`*`, (c) => {
  return fetchRequestHandler({
    endpoint: API_BASE_URL,
    req: c.req.raw,
    router: trpcRouter,
    createContext: (opts) => createContext(opts, c)
  })
})

export type * from 'redis'
export type TrpcRouter = typeof trpcRouter
