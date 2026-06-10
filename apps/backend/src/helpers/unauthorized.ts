import type { Context } from 'hono'
import { deleteTokenCookie } from './tokenCookie'
import apiError from './apiError'
import { ERROR_CODES } from '@repo/api-error-codes'

export const unauthorized = (c: Context) => {
  deleteTokenCookie(c)

  return apiError(ERROR_CODES.SESSION.UNAUTHORIZED)
}
