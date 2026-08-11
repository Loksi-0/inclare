import path from 'path'
import fs from 'fs'
import { ZipArchive } from 'archiver'
import { pipeline } from 'stream/promises'
import { createFolder } from './createFolder'

export const buildArchive = async (srcPath: string, srcUrl: string) => {
  try {
    await createFolder(srcPath)
    const outputPath = path.join(srcPath, 'archive.zip')
    const outputUrl = [srcUrl, 'archive.zip'].join('/')
    const outputStream = fs.createWriteStream(outputPath)
    const archive = new ZipArchive({
      zlib: { level: 0 },
      store: true
    })

    const excludedExt = ['.zip', '.tar', '.gz', '.tgz', 'rar', '.7z']

    archive.directory(srcPath, false, (entry) => {
      if (excludedExt.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
        return false
      }

      return entry
    })

    await archive.finalize()
    await pipeline(archive, outputStream)

    return {
      path: outputPath,
      url: outputUrl
    }
  } catch {
    return {
      path: null,
      url: null
    }
  }
}
