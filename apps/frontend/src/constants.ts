export const PAGES = {
  REGISTRATION: '/registration',
  LOGIN: '/login',
  PROFILE: '/profile',
  PLANE: '/plane',
  SETTINGS: '/settings',
  DRAFTS: '/drafts',
  MODERATOR: '/mod',
  USER: (id: string) => `/u/${id}`
}

export const DEFAULTS = {
  START_PAGE: PAGES.LOGIN,
  LIKE_COLOR: '#DD2E2E'
}

export const CURSOR = {
  POINTER: 'pointer',
  NOT_ALLOWED: 'not-allowed',
  GRAB: 'grab'
}

export const UI = {
  PLANE_GRID_SCALE: 50,
  TIMELINE_PADDING: 50
}

export const SOUNDS = {
  TAP: '/sounds/tap.mp3',
  RATCHET: '/sounds/ratchet.mp3',
  LIKE: '/sounds/like.mp3',
  PIXEL: '/sounds/pixel.mp3',
  POPUP: '/sounds/popup.mp3'
}

// скрыть курсор по желанию
// поделиться профилем
// открыть профиль для админов
// пофиксить скролл в админке на мобилке
// редактирование постов
