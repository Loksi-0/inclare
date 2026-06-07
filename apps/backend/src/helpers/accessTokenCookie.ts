import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import getEnv from './getEnv.js'

export const setAccessTokenCookie = (c: Context, token: string) => {
  setCookie(c, 'accessToken', token, {
    httpOnly: true,
    secure: getEnv('SECURE_COOKIE') === 'true',
    sameSite: 'Strict',
    maxAge: 60 * 30
  })
}

export const getAccessTokenCookie = (c: Context) => {
  return getCookie(c, 'accessToken')
}

export const deleteAccessTokenCookie = (c: Context) => {
  deleteCookie(c, 'accessToken')
}
