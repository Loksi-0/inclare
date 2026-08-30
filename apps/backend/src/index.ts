import '@backend/helpers/env'
import '@backend/scripts/clearExpiredTokens'
import '@backend/scripts/getFallingStars'
import '@backend/scripts/clearEmptyPosts'
import { serve } from '@hono/node-server'
import getEnv from '@backend/helpers/getEnv'
import rateLimit from '@backend/helpers/rateLimit'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { API_BASE_URL } from '@repo/constants'
import { UPLOADS } from './constants'
import { uploads } from './restRouters/uploads'
import { base } from './restRouters/base'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', getEnv('CLIENT_URL')],
    credentials: true
  })
)

app.use(rateLimit(1, 600))
app.route(UPLOADS.URL, uploads)
app.route(API_BASE_URL, base)

serve(
  {
    fetch: app.fetch,
    port: Number(getEnv('API_PORT'))
  },
  (info) => {
    console.log(`Server is running on port ${String(info.port)}`)
  }
)

export default app
