import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import getEnv from './getEnv'
import { COOKIES } from '@repo/constants'

export const setTokenCookie = (c: Context, token: string) => {
  setCookie(c, COOKIES.TOKEN, token, {
    httpOnly: true,
    secure: getEnv('SECURE_COOKIE') === 'true',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30
  })
}

export const getTokenCookie = (c: Context) => {
  return getCookie(c, COOKIES.TOKEN)
}

export const deleteTokenCookie = (c: Context) => {
  deleteCookie(c, COOKIES.TOKEN)
}
