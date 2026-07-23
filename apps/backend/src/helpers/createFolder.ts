import fs from 'fs/promises'

export const createFolder = async (...path: string[]) => {
  for (const p of path) {
    await fs.mkdir(p, { recursive: true })
  }
}
