import { createMiddleware } from 'hono/factory'
import type { Variables } from './hono.js'
import { HeadersSchema, type Headers } from './zod-types/headersSchema.js'
import z from 'zod'

type Env = {
  Variables: Variables & { device: Headers }
}

const parseHeaders = createMiddleware<Env>(async (c, next) => {
  const headers = {
    userAgent: c.req.header('User-Agent'),
    fingerprint: c.req.header('X-Fingerprint'),
    ip: c.req.header('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
  }

  const result = HeadersSchema.safeParse(headers)

  if (!result.success) {
    return c.json(z.flattenError(result.error).fieldErrors, 400)
  }

  c.set('device', result.data)

  await next()
})

export default parseHeaders
