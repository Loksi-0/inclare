import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import getEnv from './getEnv.js'

export const setRefreshTokenCookie = (c: Context, token: string) => {
  setCookie(c, 'refreshToken', token, {
    httpOnly: true,
    secure: getEnv('SECURE_COOKIE') === 'true',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30
  })
}

export const getRefreshTokenCookie = (c: Context) => {
  return getCookie(c, 'refreshToken')
}

export const deleteRefreshTokenCookie = (c: Context) => {
  deleteCookie(c, 'refreshToken')
}
