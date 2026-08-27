import type { Context } from 'hono'
import { getDeviceIdCookie, setDeviceIdCookie } from './deviceIdCookie'
import type { User } from '@repo/db'
import { TokenService } from '@backend/services/token.service'
import { setTokenCookie } from './tokenCookie'

export const setAuthCookies = async (c: Context, user: User) => {
  const deviceId = getDeviceIdCookie(c) || crypto.randomUUID()
  const payload = {
    userId: user.id,
    role: user.role,
    deviceId
  }

  const token = await TokenService.generateToken(payload)
  await TokenService.saveToken(token, payload)

  setDeviceIdCookie(c, deviceId)
  setTokenCookie(c, token)
}
