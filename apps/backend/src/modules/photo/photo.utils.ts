import { exiftool } from 'exiftool-vendored'
import { getColor } from 'colorthief'
import fs from 'fs/promises'

export const photoUtils = {
  getExif: async (path: string) => {
    try {
      const tags = await exiftool.read(path)

      return tags
    } catch {
      return null
    }
  },

  orientationToAngle: (orientation: number | undefined) => {
    if (!orientation) {
      return 0
    }

    const anglesMap: Record<number, number> = {
      1: 0,
      3: 180,
      6: 90,
      8: 270
    }

    return anglesMap[orientation] || 0
  },

  getPrimaryColor: async (path: string) => {
    try {
      const image = await fs.readFile(path)
      const color = await getColor(image)

      return color?.hex()
    } catch {
      return
    }
  }
}
