export const ERROR_CODES = {
  SESSION: {
    UNAUTHORIZED: {
      status: 401,
      code: 'SESSION_UNAUTHORIZED'
    }
  },
  USER: {
    NOT_FOUND: {
      status: 404,
      code: 'USER_NOT_FOUND'
    }
  },
  AUTH: {
    USER_EXISTS: {
      status: 409,
      code: 'AUTH_USER_EXISTS'
    },
    WRONG_PASSWORD: {
      status: 400,
      code: 'AUTH_WRONG_PASSWORD'
    }
  },
  REQUEST: {
    TOO_MANY_REQUESTS: {
      status: 429,
      code: 'REQUEST_TOO_MANY_REQUESTS'
    },
    FORBIDDEN: {
      status: 403,
      code: 'REQUEST_FORBIDDEN'
    }
  }
} as const

type DeepErrorCode<T> = T extends { code: infer C }
  ? C
  : T extends object
    ? { [K in keyof T]: DeepErrorCode<T[K]> }[keyof T]
    : never

export type ErrorCode = DeepErrorCode<typeof ERROR_CODES>
