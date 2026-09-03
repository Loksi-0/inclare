import { prisma } from '@backend/context'
import type { JwtSchema } from '@repo/validators'
import type { Context } from 'hono'
import { authErrors } from '@backend/modules/auth/auth.errors'
import { tokenUtils } from '../token/token.utils'

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
    return authErrors.unauthorized(honoContext)
  }

  const payload = await tokenUtils.parseJwt(token)
  const userId = getValidUserId(payload, deviceId)

  if (!payload || !userId) {
    return authErrors.unauthorized(honoContext)
  }

  return {
    payload,
    userId
  }
}
