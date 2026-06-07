import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { ErrorCode } from '../../shared/constants/errorCodes.js'

const apiError = (
  error: { status: ContentfulStatusCode; code: ErrorCode },
  message?: string
) => {
  const body = JSON.stringify({
    code: error.code,
    message: message || 'Произошла ошибка'
  })

  const response = new Response(body, {
    status: error.status,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  throw new HTTPException(error.status, { res: response })
}

export default apiError
