import { UPLOADS } from '@backend/constants'
import { getDeviceIdCookie } from '@backend/helpers/deviceIdCookie'
import getEnv from '@backend/helpers/getEnv'
import { getTokenCookie } from '@backend/helpers/tokenCookie'
import { UploadsService } from '@backend/services/uploads.service'
import { Hono } from 'hono'
import { stream } from 'hono/streaming'
import fs from 'fs'
import { CACHE_IMAGE_QUERIES } from '@repo/constants'

export const uploads = new Hono()

uploads.get('/:userId/:postId/*', async (c) => {
  const { userId, postId } = c.req.param()

  const w = c.req.query(CACHE_IMAGE_QUERIES.WIDTH)
  const h = c.req.query(CACHE_IMAGE_QUERIES.HEIGHT)

  const pathname = c.req.path

  const token = getTokenCookie(c)
  const deviceId = getDeviceIdCookie(c)

  const { path, url } = await UploadsService.serveContent({
    userId,
    postId,
    pathname,
    token,
    deviceId,
    c
  })

  if (getEnv('NODE_ENV') === 'production') {
    if (w && h) {
      const modifiedUrl = `/${getEnv('INTERNAL_CACHE_LOCATION')}${url}`

      c.header('X-Accel-Redirect', modifiedUrl)
      return c.body(null)
    }

    const fileUrl = url.replace(UPLOADS.URL, '')
    const modifiedUrl = `/${getEnv('INTERNAL_UPLOADS_LOCATION')}${fileUrl}`

    c.header('X-Accel-Redirect', modifiedUrl)
    return c.body(null)
  }

  return stream(c, async (stream) => {
    const fileStream = fs.createReadStream(path)

    for await (const c of fileStream) {
      const chunk = c as Uint8Array
      await stream.write(chunk)
    }
  })
})
