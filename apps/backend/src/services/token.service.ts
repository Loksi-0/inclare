import { prisma } from '@/context.js'
import getEnv from '@/helpers/getEnv.js'
import type { JwtSchema } from '@/validators/index.js'
import { sign } from 'hono/jwt'

export const TokenService = {
  generateToken: async (payload: JwtSchema.Payload) => {
    const token = await sign(
      {
        userId: payload.userId,
        role: payload.role,
        deviceId: payload.deviceId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
      },
      getEnv('JWT_SECRET'),
      'HS256'
    )

    return token
  },

  saveToken: async (token: string, payload: JwtSchema.Payload) => {
    const savedToken = await prisma.token.upsert({
      where: {
        userId_deviceId: {
          userId: payload.userId,
          deviceId: payload.deviceId
        }
      },
      create: {
        token,
        deviceId: payload.deviceId,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30)
      },
      update: {
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30)
      }
    })

    return savedToken
  },

  deleteAllUserTokens: async (userId: string) => {
    await prisma.token.deleteMany({ where: { userId } })
  },

  deleteToken: async (token: string) => {
    await prisma.token.delete({ where: { token } })
  },

  deleteAllExceptCurrent: async (userId: string, token: string) => {
    await prisma.token.deleteMany({
      where: {
        userId,
        token: { not: token }
      }
    })
  }
}
