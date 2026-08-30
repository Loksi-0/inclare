import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext, prisma } from '@backend/context'
import { appRouter } from '@backend/routers/_app'
import fs from 'fs/promises'
import { API_BASE_URL, CACHE_IMAGE_QUERIES } from '@repo/constants'
import { Hono } from 'hono'
import getEnv from '@backend/helpers/getEnv'
import { zValidator } from '@hono/zod-validator'
import { AdminSchema } from '@repo/validators'
import { HTTPException } from 'hono/http-exception'
import { compressAndCache } from '@backend/helpers/compressAndCache'

export const base = new Hono()

base.post(`/set-admin`, zValidator('json', AdminSchema.setAdmin), async (c) => {
  const data = c.req.valid('json')

  if (data.keyword !== getEnv('ADMIN_KEYWORD')) {
    throw new HTTPException(403, { message: 'invalid keyword' })
  }

  const candidate = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (!candidate) {
    throw new HTTPException(404, { message: 'user not found' })
  }

  const role = data.isAdmin ? 'ADMIN' : 'USER'

  await prisma.user.update({
    where: { email: data.email },
    data: { role }
  })

  return c.text(`${data.email} role set up to ${role}`)
})

base.get('/generate-cache/*', async (c) => {
  const imgUrl = c.req.path.replace('/generate-cache', '')

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

base.all(`*`, (c) => {
  return fetchRequestHandler({
    endpoint: API_BASE_URL,
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext(opts, c)
  })
})
