import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import getEnv from './getEnv.js'

export const setDeviceIdCookie = (c: Context, token: string) => {
  setCookie(c, 'deviceId', token, {
    httpOnly: true,
    secure: getEnv('SECURE_COOKIE') === 'true',
    sameSite: 'Strict'
  })
}

export const getDeviceIdCookie = (c: Context) => {
  return getCookie(c, 'deviceId')
}

export const deleteDeviceIdCookie = (c: Context) => {
  deleteCookie(c, 'deviceId')
}
