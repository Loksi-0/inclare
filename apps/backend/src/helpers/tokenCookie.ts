import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import getEnv from './getEnv'

export const setTokenCookie = (c: Context, token: string) => {
  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: getEnv('SECURE_COOKIE') === 'true',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30
  })
}

export const getTokenCookie = (c: Context) => {
  return getCookie(c, 'token')
}

export const deleteTokenCookie = (c: Context) => {
  deleteCookie(c, 'token')
}
