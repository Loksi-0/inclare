import { UPLOAD_DEFAULTS } from '@backend/constants'
import { createFolder } from './createFolder'
import fs from 'fs/promises'

export const getRandomAvatar = async () => {
  await createFolder(UPLOAD_DEFAULTS.AVATAR.PATH)

  const avatars = await fs.readdir(UPLOAD_DEFAULTS.AVATAR.PATH)
  const randomAvatar = avatars[Math.round(Math.random() * (avatars.length - 1))]

  return `${UPLOAD_DEFAULTS.AVATAR.URL}/${randomAvatar}`
}
