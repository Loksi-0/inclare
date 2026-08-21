import { prisma } from '@backend/context'
import { unauthorized } from './unauthorized'
import { parseJwtToken } from './parseJwtToken'
import type { JwtSchema } from '@repo/validators'
import type { Context } from 'hono'

const getValidUserId = (
  payload: JwtSchema.Payload | null,
  deviceId: string | undefined
) => {
  if (!payload || !deviceId) {
    return null
  }

  return payload.deviceId === deviceId ? payload.userId : null
}

type CheckUserOpts = {
  token: string
  deviceId: string
  honoContext: Context
}

export const checkUser = async ({
  token,
  deviceId,
  honoContext
}: CheckUserOpts) => {
  const dbToken = await prisma.token.findUnique({
    where: { token }
  })

  if (!dbToken) {
    return unauthorized(honoContext)
  }

  const payload = await parseJwtToken(token)
  const userId = getValidUserId(payload, deviceId)

  if (!payload || !userId) {
    return unauthorized(honoContext)
  }

  return {
    payload,
    userId
  }
}
