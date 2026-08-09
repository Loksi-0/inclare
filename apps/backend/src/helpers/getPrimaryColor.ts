import { getColor } from 'colorthief'
import fs from 'fs/promises'

export const getPrimaryColor = async (path: string) => {
  try {
    const image = await fs.readFile(path)
    const color = await getColor(image)

    return color?.hex()
  } catch {
    return
  }
}
