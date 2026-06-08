import type { ErrorCode } from '@repo/api-error-codes'
import { TRPCError } from '@trpc/server'
import { HTTPToTRPCStatus } from './HTTPToTRPCStatus.js'

type ErrorPayload = {
  status: number
  code: ErrorCode
}

const apiError = (error: ErrorPayload, message?: string) => {
  const trpcStatus = HTTPToTRPCStatus(error.status)

  throw new TRPCError({
    code: trpcStatus,
    message: message || 'Произошла ошибка',
    cause: {
      code: error.code,
      message
    }
  })
}

export default apiError
