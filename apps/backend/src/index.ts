import '@backend/helpers/env'
import '@backend/scripts/clearExpiredTokens'
import '@backend/scripts/getFallingStars'
import { serve } from '@hono/node-server'
import getEnv from '@backend/helpers/getEnv'
import { serveStatic } from '@hono/node-server/serve-static'
import rateLimit from '@backend/helpers/rateLimit'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from '@backend/context'
import { appRouter } from '@backend/routers/_app'
import { UPLOADS } from './constants'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', getEnv('CLIENT_URL')],
    credentials: true
  })
)

app.use(`${UPLOADS.URL}/*`, serveStatic({ root: './' }))
app.use(rateLimit(1, 90))
app.use('*', compress())

app.all('/trpc/*', (c) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext(opts, c)
  })
})

serve(
  {
    fetch: app.fetch,
    port: Number(getEnv('PORT'))
  },
  (info) => {
    console.log(`Server is running on port ${String(info.port)}`)
  }
)

export default app
