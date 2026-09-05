import path from 'path'

export const ROOT = {
  PATH: process.cwd(),
  URL: '/'
}

export const UPLOADS = {
  PATH: path.join(ROOT.PATH, 'uploads'),
  URL: '/uploads'
}

export const USER_FOLDER = {
  PATH: (userId: string) => path.join(UPLOADS.PATH, userId),
  URL: (userId: string) => [UPLOADS.URL, userId].join('/')
}

export const POST = {
  PATH: (userId: string, postId: string) =>
    path.join(USER_FOLDER.PATH(userId), postId),
  URL: (userId: string, postId: string) =>
    [USER_FOLDER.URL(userId), postId].join('/')
}

export const RAW_POST = {
  PATH: (userId: string, postId: string) =>
    path.join(POST.PATH(userId, postId), 'raw'),
  URL: (userId: string, postId: string) =>
    [POST.URL(userId, postId), 'raw'].join('/')
}

export const OPTIMIZED_POST = {
  PATH: (userId: string, postId: string) =>
    path.join(POST.PATH(userId, postId), 'optimized'),
  URL: (userId: string, postId: string) =>
    [POST.URL(userId, postId), 'optimized'].join('/')
}

export const TEMP_POST = {
  PATH: (userId: string, postId: string) =>
    path.join(POST.PATH(userId, postId), 'temp')
}

export const USER_PROFILE = {
  PATH: (userId: string) => path.join(UPLOADS.PATH, userId, 'profile'),
  URL: (userId: string) => [UPLOADS.URL, userId, 'profile'].join('/')
}

export const CACHE = {
  PATH: path.join(UPLOADS.PATH, 'cache'),
  URL: [UPLOADS.URL, 'cache'].join('/')
}

export const UPLOAD_DEFAULTS = {
  AVATAR: {
    PATH: path.join(UPLOADS.PATH, 'defaults', 'avatars'),
    URL: [UPLOADS.URL, 'defaults', 'avatars'].join('/')
  }
}

export const ALGORITHM_DEFAULTS = {
  GRAVITY: '1.7',
  K: '2',
  PAST_INTERVAL: '12',
  NOW_INTERVAL: '6'
}

export const BULLMQ = {
  NAMES: {
    COMPRESS: 'compress'
  },
  QUEUES: {
    COMPRESS: 'CompressImage'
  }
}

export const REDIS_KEYS = {
  STARS: {
    VIEWED: 'stars:viewed'
  },
  MODERATOR: {
    VIEWED: 'moderator:viewed'
  },
  USER: {
    VIEWED: (userId: string) => `user:${userId}:viewed`
  },
  CONFIG: {
    ALGORITHM: 'config:algo'
  }
}
