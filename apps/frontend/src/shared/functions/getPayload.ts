import type { JwtSchema } from '@repo/validators'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { COOKIES } from '@repo/constants'

const SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET)

export const getPayload = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIES.TOKEN)?.value

  if (!token) {
    return null
  }

  const { payload } = await jwtVerify<JwtSchema.Payload>(token, SECRET)

  return payload
})
