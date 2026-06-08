export const ERROR_CODES = {
  USER: {
    NOT_FOUND: {
      status: 404,
      code: 'USER_NOT_FOUND'
    }
  },
  REQUEST: {
    TOO_MANY_REQUESTS: {
      status: 429,
      code: 'REQUEST_TOO_MANY_REQUESTS'
    }
  }
} as const

type DeepErrorCode<T> = T extends { code: infer C }
  ? C
  : T extends object
    ? { [K in keyof T]: DeepErrorCode<T[K]> }[keyof T]
    : never

export type ErrorCode = DeepErrorCode<typeof ERROR_CODES>
