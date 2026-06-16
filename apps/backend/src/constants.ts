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

export const REDIS_KEYS = {
  STARS: {
    VIEWED: 'stars:viewed'
  },
  USER: {
    VIEWED: (userId: string) => `user:${userId}:viewed`
  },
  CONFIG: {
    GRAVITY: 'config:gravity',
    FALLING_STAR: {
      K: 'config:falling_star:k',
      PAST_INTERVAL: 'config:falling_star:past',
      NOW_INTERVAL: 'config:falling_star:now'
    }
  }
}
