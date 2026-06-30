import path from 'path'

export const UPLOADS = {
  PATH: path.join(process.cwd(), 'uploads'),
  URL: '/uploads'
}

export const RAW_POST = {
  PATH: (userId: string, postId: string) =>
    path.join(UPLOADS.PATH, userId, postId, 'raw'),
  URL: (userId: string, postId: string) =>
    [UPLOADS.URL, userId, postId, 'raw'].join('/')
}

export const OPTIMIZED_POST = {
  PATH: (userId: string, postId: string) =>
    path.join(UPLOADS.PATH, userId, postId, 'optimized'),
  URL: (userId: string, postId: string) =>
    [UPLOADS.URL, userId, postId, 'optimized'].join('/')
}

export const TEMP_POST = {
  PATH: (userId: string, postId: string) =>
    path.join(UPLOADS.PATH, userId, postId, 'temp')
}

export const USER_PROFILE = {
  PATH: (userId: string) => path.join(UPLOADS.PATH, userId, 'profile'),
  URL: (userId: string) => [UPLOADS.URL, userId, 'profile'].join('/')
}

export const ALGORITHM_DEFAULTS = {
  GRAVITY: '1.7',
  K: '2',
  PAST_INTERVAL: '12',
  NOW_INTERVAL: '6'
}

export const REDIS_KEYS = {
  STARS: {
    VIEWED: 'stars:viewed'
  },
  USER: {
    VIEWED: (userId: string) => `user:${userId}:viewed`
  },
  CONFIG: {
    ALGORITHM: 'config:algo'
  }
}
