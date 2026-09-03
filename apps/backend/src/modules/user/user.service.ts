import { USER_PROFILE } from '@backend/constants'
import { createFolder } from '@backend/shared/createFolder'
import cuid from '@bugsnag/cuid'
import fs from 'fs/promises'
import path from 'path'
import { compressImage } from '../photo/photo.compress'
import { prisma } from '@backend/context'
import { userUtils } from './user.utils'
import { uploadsUtils } from '../uploads/uploads.utils'

type UserInput = {
  setAvatar: {
    userId: string
    avatar: string | null
    file?: File | null
  }
}

export const userService = {
  setAvatar: async (input: UserInput['setAvatar']) => {
    await createFolder(USER_PROFILE.PATH(input.userId))

    if (input.avatar) {
      const prevAvatarPath = uploadsUtils.getFilePathByUrl(input.avatar)

      if (!prevAvatarPath.includes(path.join('defaults', 'avatars'))) {
        await fs.unlink(prevAvatarPath)
      }
    }

    if (!input.file) {
      const avatarLink = await userUtils.getRandomAvatar()

      await prisma.user.update({
        where: { id: input.userId },
        data: { avatar: avatarLink }
      })

      return avatarLink
    }

    const avatarId = cuid()
    const avatarName = `avatar_${avatarId}.webp`

    const avatarPath = path.join(USER_PROFILE.PATH(input.userId), avatarName)
    const avatarLink = `${USER_PROFILE.URL(input.userId)}/${avatarName}`

    const bytes = await input.file.bytes()
    const imgBuffer = Buffer.from(bytes)

    await compressImage('webp', {
      width: 1000,
      height: 1000,
      img: imgBuffer,
      fit: 'cover',
      output: avatarPath,
      animated: true
    })

    await prisma.user.update({
      where: { id: input.userId },
      data: { avatar: avatarLink }
    })

    return avatarLink
  }
}
