import path from 'path'
import { CACHE } from '@backend/constants'
import { compressImage } from './photo.compress'
import { uploadsUtils } from '../uploads/uploads.utils'
import getEnv from '@backend/shared/getEnv'
import { createFolder } from '@backend/shared/createFolder'

type Options = {
  imgUrl: string
  width?: number
  height?: number
}

export const compressAndCache = async ({ imgUrl, width, height }: Options) => {
  const imgPath = uploadsUtils.getFilePathByUrl(imgUrl)
  const imgName = imgUrl.split('/').at(-1)?.split('.').at(0)

  if (!width || !height || !imgName) {
    return { path: imgPath, url: imgUrl }
  }

  const format = getEnv('IMAGE_COMPRESSION') === 'avif' ? 'avif' : 'webp'

  await createFolder(CACHE.PATH)
  const cacheName = `${imgName}_${String(width)}_${String(height)}.${format}`
  const cacheUrl = [CACHE.URL, cacheName].join('/')
  const cachePath = path.join(CACHE.PATH, cacheName)

  await compressImage(format, {
    width,
    height,
    img: imgPath,
    output: cachePath,
    fit: 'inside'
  })

  return { path: cachePath, url: cacheUrl, format }
}
