import apiError from '@backend/shared/apiError'
import getEnv from '@backend/shared/getEnv'
import { ERROR_CODES } from '@repo/api-error-codes'
import bcrypt from 'bcryptjs'
import { prisma } from '@backend/context'
import type { Context } from 'hono'
import type { AuthSchema } from '@repo/validators'
import { authUtils } from './auth.utils'
import { userUtils } from '../user/user.utils'

type AuthInput = {
  register: AuthSchema.Register & { context: Context }
  login: AuthSchema.Login & { context: Context }
}

export const authService = {
  register: async (input: AuthInput['register']) => {
    const candidate = await prisma.user.findUnique({
      where: { email: input.email }
    })

    if (candidate) {
      return apiError(ERROR_CODES.AUTH.USER_EXISTS)
    }

    const SALT_ROUNDS = Number(getEnv('PASSWORD_SALT_ROUNDS')) || 12
    const hashPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

    if (!input.avatar) {
      input.avatar = await userUtils.getRandomAvatar()
    }

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashPassword,
        description: input.description,
        avatar: input.avatar
      }
    })

    await authUtils.setAuthCookies(input.context, user)

    return user
  },

  login: async (input: AuthInput['login']) => {
    const user = await prisma.user.findUnique({
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

    await authUtils.setAuthCookies(input.context, user)

    return user
  }
}
