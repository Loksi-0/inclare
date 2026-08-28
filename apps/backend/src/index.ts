import '@backend/helpers/env'
import '@backend/scripts/clearExpiredTokens'
import '@backend/scripts/getFallingStars'
import '@backend/scripts/clearEmptyPosts'
import { serve } from '@hono/node-server'
import getEnv from '@backend/helpers/getEnv'
import rateLimit from '@backend/helpers/rateLimit'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { baseRouter } from './router'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', getEnv('CLIENT_URL')],
    credentials: true
  })
)

app.use(rateLimit(1, 600))
app.route('/', baseRouter)

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
