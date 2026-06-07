import '@/helpers/env.js'
import { serve } from '@hono/node-server'
import getEnv from '@/helpers/getEnv.js'
import { serveStatic } from '@hono/node-server/serve-static'
import rateLimit from '@/helpers/rateLimit.js'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from './context.js'
import { appRouter } from './routers/_app.js'

const app = new Hono()

app.use(
  '/trpc/*',
  cors({
    origin: ['http://localhost:3000', getEnv('CLIENT_URL')],
    credentials: true
  })
)

app.use('/uploads/*', serveStatic({ root: './' }))
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
