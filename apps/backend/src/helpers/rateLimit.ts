import { rateLimiter } from 'hono-rate-limiter'
import apiError from './apiError.js'
import ERROR_CODES from '../../shared/constants/errorCodes.js'

const rateLimit = (minutes: number, limit: number) => {
  return rateLimiter({
    windowMs: 1000 * 60 * minutes,
    limit,
    keyGenerator: (c) =>
      c.req.header('x-forwarded-for') ||
      c.req.header('cf-connecting-ip') ||
      'unknown',
    handler: () => {
      apiError(
        ERROR_CODES.REQUEST.TOO_MANY_REQUESTS,
        `Слишком много попыток. Попробуйте через ${String(minutes)} минут`
      )
    }
  })
}

export default rateLimit
