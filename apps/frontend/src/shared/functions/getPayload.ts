import type { JwtSchema } from '@repo/validators'
import { jwtVerify } from 'jose'
import { cache } from 'react'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export const getPayload = cache(async (token: string | undefined) => {
  try {
    if (!token) {
      return null
    }

    const { payload } = await jwtVerify<JwtSchema.Payload>(token, SECRET)

    return payload
  } catch {
    return null
  }
})
