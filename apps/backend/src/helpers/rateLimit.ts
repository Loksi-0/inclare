import { rateLimiter } from 'hono-rate-limiter'
import apiError from './apiError'
import { ERROR_CODES } from '@repo/api-error-codes'

const rateLimit = (minutes: number, limit: number) => {
  return rateLimiter({
    windowMs: 1000 * 60 * minutes,
    limit,
    keyGenerator: (c) =>
      c.req.header('x-forwarded-for') ||
      c.req.header('cf-connecting-ip') ||
      'unknown',
    handler: () => {
      return apiError(ERROR_CODES.REQUEST.TOO_MANY_REQUESTS)
    }
  })
}

export default rateLimit
