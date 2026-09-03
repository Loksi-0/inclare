import type { ErrorCode } from '@repo/api-error-codes'
import { TRPCError } from '@trpc/server'
import { HTTPToTRPCStatus } from './HTTPToTRPCStatus'

type ErrorPayload = {
  status: number
  code: ErrorCode
}

const apiError = (error: ErrorPayload) => {
  const trpcStatus = HTTPToTRPCStatus(error.status)

  throw new TRPCError({
    code: trpcStatus,
    message: error.code
  })
}

export default apiError
