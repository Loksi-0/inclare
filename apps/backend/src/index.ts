import './init'
import { serve } from '@hono/node-server'
import getEnv from '@backend/shared/getEnv'
import rateLimit from '@backend/shared/rateLimit'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { appRouter } from './router'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', getEnv('CLIENT_URL')],
    credentials: true
  })
)

app.use(rateLimit(1, 600))
app.route('/', appRouter)

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
