import '@backend/helpers/env'
import '@backend/scripts/clearExpiredTokens'
import '@backend/scripts/getFallingStars'
import '@backend/scripts/clearEmptyPosts'
import { serve } from '@hono/node-server'
import getEnv from '@backend/helpers/getEnv'
import rateLimit from '@backend/helpers/rateLimit'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from '@backend/context'
import { appRouter } from '@backend/routers/_app'
import { UPLOADS } from './constants'
import fs from 'fs'
import { stream } from 'hono/streaming'
import { UploadsService } from './services/uploads.service'
import { getTokenCookie } from './helpers/tokenCookie'
import { getDeviceIdCookie } from './helpers/deviceIdCookie'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', getEnv('CLIENT_URL')],
    credentials: true
  })
)

app.use(rateLimit(1, 600))

app.get(`${UPLOADS.URL}/:userId/:postId/*`, async (c) => {
  const { userId, postId } = c.req.param()
  const pathname = c.req.path
  const token = getTokenCookie(c)
  const deviceId = getDeviceIdCookie(c)

  const { path, url } = await UploadsService.serveContent({
    userId,
    postId,
    pathname,
    token,
    deviceId,
    c
  })

  if (getEnv('NODE_ENV') === 'production') {
    c.header('X-Accel-Redirect', url)
    return c.body(null)
  }

  return stream(c, async (stream) => {
    const fileStream = fs.createReadStream(path)

    for await (const c of fileStream) {
      const chunk = c as Uint8Array
      await stream.write(chunk)
    }
  })
})

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
