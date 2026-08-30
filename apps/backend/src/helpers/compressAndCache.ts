import path from 'path'
import { compressImage } from './compressImage'
import getEnv from './getEnv'
import { getFilePathByUrl } from './getFilePathByUrl'
import { CACHE } from '@backend/constants'
import { createFolder } from './createFolder'

type Options = {
  imgUrl: string
  width?: number
  height?: number
}

export const compressAndCache = async ({ imgUrl, width, height }: Options) => {
  const imgPath = getFilePathByUrl(imgUrl)
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
