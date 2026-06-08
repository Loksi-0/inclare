import { verify } from 'hono/jwt'
import getEnv from './getEnv.js'
import { JwtSchema } from '@/validators/index.js'

export const parseJwtToken = async (token: string | undefined) => {
  try {
    if (!token) {
      return null
    }

    const payload = await verify(token, getEnv('JWT_SECRET'), 'HS256')
    const parsedPayload = JwtSchema.payload.safeParse(payload)

    return parsedPayload.success ? parsedPayload.data : null
  } catch {
    return null
  }
}
