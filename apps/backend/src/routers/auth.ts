import apiError from '@backend/helpers/apiError'
import getEnv from '@backend/helpers/getEnv'
import { protectedProcedure } from '@backend/procedures/protected.procedure'
import { publicProcedure, router } from '@backend/trpc'
import { TokenService } from '@backend/services/token.service'
import { AuthSchema } from '@repo/validators'
import { ERROR_CODES } from '@repo/api-error-codes'
import bcrypt from 'bcryptjs'
import { setAuthCookies } from '@backend/helpers/setAuthCookies'
import { deleteTokenCookie } from '@backend/helpers/tokenCookie'
import { getRandomAvatar } from '@backend/helpers/getRandomAvatar'

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

      if (!input.avatar) {
        input.avatar = await getRandomAvatar()
      }

      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashPassword,
          description: input.description,
          avatar: input.avatar
        }
      })

      await setAuthCookies(ctx.honoContext, user)

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

      await setAuthCookies(ctx.honoContext, user)

      return user
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user
  }),

  logoutCurrentDevice: protectedProcedure.mutation(async ({ ctx }) => {
    await TokenService.deleteToken(ctx.token)
    deleteTokenCookie(ctx.honoContext)
  }),

  logoutAll: protectedProcedure.mutation(async ({ ctx }) => {
    await TokenService.deleteAllUserTokens(ctx.user.id)
    deleteTokenCookie(ctx.honoContext)
  }),

  logoutAllExceptCurrent: protectedProcedure.mutation(async ({ ctx }) => {
    await TokenService.deleteAllExceptCurrent(ctx.user.id, ctx.token)
  })
})
