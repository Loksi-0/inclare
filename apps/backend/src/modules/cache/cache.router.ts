import { API_BASE_URL, CACHE_IMAGE_QUERIES } from '@repo/constants'
import { Hono } from 'hono'
import { compressAndCache } from '../photo/photo.cache'
import fs from 'fs/promises'

export const cache = new Hono()

cache.get('/generate-cache/*', async (c) => {
  const imgUrl = c.req.path.replace(`${API_BASE_URL}/generate-cache`, '')

  const w = c.req.query(CACHE_IMAGE_QUERIES.WIDTH)
  const h = c.req.query(CACHE_IMAGE_QUERIES.HEIGHT)

  const { path, format } = await compressAndCache({
    imgUrl,
    width: Number(w),
    height: Number(h)
  })

  const imageBuffer = await fs.readFile(path)

  c.header('Content-Type', `image/${format || 'webp'}`)
  c.header('Cache-Control', 'public, max-age=432000')

  return c.body(imageBuffer)
})
