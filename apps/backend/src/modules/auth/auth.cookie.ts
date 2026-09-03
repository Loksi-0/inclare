import getEnv from '@backend/shared/getEnv'
import { COOKIES } from '@repo/constants'
import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

export const authCookie = {
  setToken: (c: Context, token: string) => {
    setCookie(c, COOKIES.TOKEN, token, {
      httpOnly: true,
      secure: getEnv('SECURE_COOKIE') === 'true',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24 * 30
    })
  },

  getToken: (c: Context) => {
    return getCookie(c, COOKIES.TOKEN)
  },

  deleteToken: (c: Context) => {
    deleteCookie(c, COOKIES.TOKEN)
  },

  setDeviceId: (c: Context, deviceId: string) => {
    setCookie(c, COOKIES.DEVICE_ID, deviceId, {
      httpOnly: true,
      secure: getEnv('SECURE_COOKIE') === 'true',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24 * 365
    })
  },

  getDeviceId: (c: Context) => {
    return getCookie(c, COOKIES.DEVICE_ID)
  },

  deleteDeviceId: (c: Context) => {
    deleteCookie(c, COOKIES.DEVICE_ID)
  }
}
