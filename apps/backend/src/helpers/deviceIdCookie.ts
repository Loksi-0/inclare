import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import getEnv from './getEnv'
import { COOKIES } from '@repo/constants'

export const setDeviceIdCookie = (c: Context, deviceId: string) => {
  setCookie(c, COOKIES.DEVICE_ID, deviceId, {
    httpOnly: true,
    secure: getEnv('SECURE_COOKIE') === 'true',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 365
  })
}

export const getDeviceIdCookie = (c: Context) => {
  return getCookie(c, COOKIES.DEVICE_ID)
}

export const deleteDeviceIdCookie = (c: Context) => {
  deleteCookie(c, COOKIES.DEVICE_ID)
}
