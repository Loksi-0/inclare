import { exiftool } from 'exiftool-vendored'

export const getExif = async (path: string) => {
  try {
    const tags = await exiftool.read(path)

    return tags
  } catch {
    return null
  }
}
