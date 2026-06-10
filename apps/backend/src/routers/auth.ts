import apiError from '@/helpers/apiError'
import getEnv from '@/helpers/getEnv'
import { protectedProcedure } from '@/procedures/protected.procedure'
import { publicProcedure, router } from '@/trpc'
import { TokenService } from '@/services/token.service'
import { AuthSchema } from '@/validators/index'
import type { User } from '@db/client'
import { ERROR_CODES } from '@repo/api-error-codes'
import bcrypt from 'bcryptjs'
import type { Context } from 'hono'
import { getDeviceIdCookie, setDeviceIdCookie } from '@/helpers/deviceIdCookie'
import { setTokenCookie } from '@/helpers/tokenCookie'

const setCookies = async (c: Context, user: User) => {
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

export const authRouter = router({
  register: publicProcedure
    .input(AuthSchema.register)
    .mutation(async ({ ctx, input }) => {
      const candidate = await ctx.prisma.user.findUnique({
        where: { email: input.email }
      })

      if (candidate) {
        return apiError(ERROR_CODES.AUTH.USER_EXISTS)
      }

      const SALT_ROUNDS = Number(getEnv('PASSWORD_SALT_ROUNDS')) || 12
      const hashPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashPassword
        }
      })

      await setCookies(ctx.honoContext, user)

      return user
    }),

  login: publicProcedure
    .input(AuthSchema.login)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email }
      })

      if (!user) {
        return apiError(ERROR_CODES.USER.NOT_FOUND)
      }

      const arePasswordsEqual = await bcrypt.compare(
        input.password,
        user.password
      )

      if (!arePasswordsEqual) {
        return apiError(ERROR_CODES.AUTH.WRONG_PASSWORD)
      }

      await setCookies(ctx.honoContext, user)

      return user
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user
  }),

  logoutCurrentDevice: protectedProcedure.mutation(async ({ ctx }) => {
    await TokenService.deleteToken(ctx.token)
  }),

  logoutAll: protectedProcedure.mutation(async ({ ctx }) => {
    await TokenService.deleteAllUserTokens(ctx.user.id)
  }),

  logoutAllExceptCurrent: protectedProcedure.mutation(async ({ ctx }) => {
    await TokenService.deleteAllExceptCurrent(ctx.user.id, ctx.token)
  })
})
