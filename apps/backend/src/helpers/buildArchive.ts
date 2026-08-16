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
      store: true
    })

    const excludedExt = ['.zip', '.tar', '.gz', '.tgz', '.rar', '.7z']

    archive.directory(srcPath, false, (entry) => {
      if (excludedExt.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
        return false
      }

      return entry
    })

    const pipelinePromise = pipeline(archive, outputStream)
    await archive.finalize()
    await pipelinePromise

    return {
      path: outputPath,
      url: outputUrl
    }
  } catch (e) {
    console.log('ошибка архивации: ', e)

    return {
      path: null,
      url: null
    }
  }
}
