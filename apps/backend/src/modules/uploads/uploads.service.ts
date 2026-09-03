import { prisma } from '@backend/context'
import { ERROR_CODES } from '@repo/api-error-codes'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import fs from 'fs'
import { uploadsUtils } from './uploads.utils'
import { checkUser } from '../auth/auth.check'

type UploadsInput = {
  serveContent: {
    userId: string
    postId: string
    pathname: string
    token?: string
    deviceId?: string
    c?: Context
  }
}

export const UploadsService = {
  serveContent: async (input: UploadsInput['serveContent']) => {
    const { userId, postId, pathname, token, deviceId, c } = input

    let tokenUserId = null

    if (token && deviceId && c) {
      const { userId } = await checkUser({ token, deviceId, honoContext: c })
      tokenUserId = userId
    }

    if (!pathname.includes('/defaults') && !pathname.includes('/profile')) {
      const post = await prisma.post.findUnique({
        where: { authorId: userId, id: postId },
        include: { author: true }
      })

      if (
        (post?.author.isBanned || post?.author.isPrivate || post?.isDrafted) &&
        tokenUserId !== post.authorId
      ) {
        throw new HTTPException(ERROR_CODES.REQUEST.FORBIDDEN.status, {
          message: ERROR_CODES.REQUEST.FORBIDDEN.code
        })
      }
    }

    const contentPath = uploadsUtils.getFilePathByUrl(pathname)

    if (!fs.existsSync(contentPath)) {
      throw new HTTPException(ERROR_CODES.PHOTO.NOT_FOUND.status, {
        message: ERROR_CODES.PHOTO.NOT_FOUND.code
      })
    }

    return {
      path: contentPath,
      url: pathname
    }
  }
}
