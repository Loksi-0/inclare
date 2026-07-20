import type { ErrorCode } from '@repo/api-error-codes'

const errorMessages: Record<ErrorCode, string> = {
  SESSION_UNAUTHORIZED: 'Вы вышли из аккаунта',

  POST_NOT_FOUND: 'Пост не найден',

  PHOTO_UNSUPPORTED_FORMAT: 'Неподдерживаемый формат фотографии',

  USER_NOT_FOUND: 'Пользователь не найден',

  AUTH_USER_EXISTS: 'Такой пользователь уже существует',
  AUTH_WRONG_PASSWORD: 'ERR: НЕВЕРНЫЙ_ПАРОЛЬ',

  CONFIG_WRONG_INTERVALS: 'Неверные интервалы в конфиге',
  CONFIG_WRONG_GRAVITY: 'Неверный gravity в конфиге',
  CONFIG_WRONG_FALLING_STAR_K: 'Неверный K в конфиге',

  REQUEST_TOO_MANY_REQUESTS: 'Слишком много запросов, попробуйте позже',
  REQUEST_FORBIDDEN: 'Доступ запрещен',

  SERVER_INTERNAL_ERROR: 'Непредвиденная ошибка'
}

export const defineErrorMessage = (code: string) => {
  return errorMessages[code as ErrorCode] || errorMessages.SERVER_INTERNAL_ERROR
}
