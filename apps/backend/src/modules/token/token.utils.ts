import { verify } from 'hono/jwt'
import { JwtSchema } from '@repo/validators'
import getEnv from '@backend/shared/getEnv'

export const tokenUtils = {
  parseJwt: async (token: string | null) => {
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
}
