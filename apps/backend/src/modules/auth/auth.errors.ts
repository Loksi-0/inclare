import type { Context } from 'hono'
import { authCookie } from './auth.cookie'
import apiError from '@backend/shared/apiError'
import { ERROR_CODES } from '@repo/api-error-codes'

export const authErrors = {
  unauthorized: (c: Context) => {
    authCookie.deleteToken(c)

    return apiError(ERROR_CODES.SESSION.UNAUTHORIZED)
  }
}
