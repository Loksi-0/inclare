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
