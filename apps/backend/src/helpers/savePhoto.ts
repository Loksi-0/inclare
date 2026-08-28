import fs, { constants } from 'fs/promises'
import cuid from '@bugsnag/cuid'
import path from 'path'
import { OPTIMIZED_POST, RAW_POST, TEMP_POST } from '@backend/constants'
import { getExif } from './getExif'
import { exiftool } from 'exiftool-vendored'
import apiError from './apiError'
import { ERROR_CODES } from '@repo/api-error-codes'
import getEnv from './getEnv'
import { orientationToAngle } from './orientationToAngle'
import { compressImage } from './compressImage'

type Options = {
  file: File
  userId: string
  postId: string
}

export const savePhoto = async ({ file, userId, postId }: Options) => {
  // check access
  try {
    await fs.access(RAW_POST.PATH(userId, postId), constants.F_OK)
    await fs.access(OPTIMIZED_POST.PATH(userId, postId), constants.F_OK)
    await fs.access(TEMP_POST.PATH(userId, postId), constants.F_OK)
  } catch {
    return apiError(ERROR_CODES.POST.NOT_FOUND)
  }

  // photo paths and urls
  const photoId = cuid()

  const fileExt = file.name.split('.').at(-1)
  const optimizedExt = getEnv('IMAGE_COMPRESSION') === 'avif' ? 'avif' : 'webp'

  const rawName = `${photoId}.${fileExt || 'jpg'}`
  const optimizedName = `${photoId}.${optimizedExt}`

  const rawPath = path.join(RAW_POST.PATH(userId, postId), rawName)
  const optimizedPath = path.join(
    OPTIMIZED_POST.PATH(userId, postId),
    optimizedName
  )
  const tempPath = path.join(TEMP_POST.PATH(userId, postId), optimizedName)

  const rawUrl = `${RAW_POST.URL(userId, postId)}/${rawName}`
  const optimizedUrl = `${OPTIMIZED_POST.URL(userId, postId)}/${optimizedName}`

  // write photo
  try {
    const arrayBuffer = await file.arrayBuffer()
    const rawBuffer = Buffer.from(arrayBuffer)
    await fs.writeFile(rawPath, rawBuffer)

    let isRaw = true

    try {
      await exiftool.extractJpgFromRaw(rawPath, tempPath)
    } catch {
      try {
        await exiftool.extractPreview(rawPath, tempPath)
      } catch {
        isRaw = false
      }
    }

    // exif
    const exif = await getExif(rawPath)

    const angle = orientationToAngle(exif?.Orientation)

    const exifDto = {
      shutterSpeed: exif?.ShutterSpeed?.trim(),
      iso: exif?.ISO,
      aperture: exif?.Aperture,
      focalLength: exif?.FocalLength?.trim(),
      cameraModel: exif?.Model?.trim()
    }

    const compressOptions = {
      width: 1920,
      height: null,
      img: isRaw ? tempPath : rawBuffer,
      output: optimizedPath,
      angle
    }

    await compressImage(optimizedExt, compressOptions)

    if (isRaw) {
      await fs.unlink(tempPath)
    }

    return {
      id: photoId,
      rawUrl,
      optimizedUrl,
      rawPath,
      optimizedPath,
      exif: exifDto
    }
  } catch {
    return apiError(ERROR_CODES.PHOTO.UNSUPPORTED_FORMAT)
  }
}
