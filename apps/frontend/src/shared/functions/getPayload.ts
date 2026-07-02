import type { JwtPayload } from '@/types/jwtPayload'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { cache } from 'react'

const SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET)

export const getPayload = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  if (!token) {
    return null
  }

  const { payload } = await jwtVerify<JwtPayload>(token, SECRET)

  return payload
})
