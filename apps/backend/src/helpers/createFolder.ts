import fs from 'fs/promises'

export const createFolder = async (path: string) => {
  await fs.mkdir(path, { recursive: true })
}
