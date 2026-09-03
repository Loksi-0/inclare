import { publicProcedure, router } from '@backend/trpc'
import { AuthSchema } from '@repo/validators'
import { hybridProcedure } from '@backend/procedures/hybrid.procedure'
import { authService } from './auth.service'
import { tokenService } from '@backend/modules/token/token.service'
import { authCookie } from './auth.cookie'
import { authErrors } from './auth.errors'

export const authRouter = router({
  register: publicProcedure
    .input(AuthSchema.register)
    .mutation(async ({ ctx, input }) => {
      const user = await authService.register({
        ...input,
        context: ctx.context
      })

      return user
    }),

  login: publicProcedure
    .input(AuthSchema.login)
    .mutation(async ({ ctx, input }) => {
      const user = await authService.login({
        ...input,
        context: ctx.context
      })

      return user
    }),

  logoutCurrentDevice: hybridProcedure.mutation(async ({ ctx }) => {
    if (!ctx.token) {
      return authErrors.unauthorized(ctx.context)
    }

    await tokenService.deleteToken(ctx.token)
    authCookie.deleteToken(ctx.context)
  }),

  logoutAll: hybridProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) {
      return authErrors.unauthorized(ctx.context)
    }

    await tokenService.deleteAllUserTokens(ctx.user.id)
    authCookie.deleteToken(ctx.context)
  }),

  logoutAllExceptCurrent: hybridProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user || !ctx.token) {
      return authErrors.unauthorized(ctx.context)
    }

    await tokenService.deleteAllExceptCurrent(ctx.user.id, ctx.token)
  })
})
