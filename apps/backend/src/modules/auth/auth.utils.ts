import type { Context } from 'hono'
import type { User } from '@repo/db'
import { authCookie } from './auth.cookie'
import { tokenService } from '../token/token.service'

export const authUtils = {
  setAuthCookies: async (c: Context, user: User) => {
    const deviceId = authCookie.getDeviceId(c) || crypto.randomUUID()
    const payload = {
      userId: user.id,
      role: user.role,
      deviceId
    }

    const token = await tokenService.generateToken(payload)
    await tokenService.saveToken(token, payload)

    authCookie.setDeviceId(c, deviceId)
    authCookie.setToken(c, token)
  }
}
