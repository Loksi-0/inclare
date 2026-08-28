import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext, prisma } from '@backend/context'
import { appRouter } from '@backend/routers/_app'
import { UPLOADS } from './constants'
import fs from 'fs'
import { stream } from 'hono/streaming'
import { UploadsService } from './services/uploads.service'
import { getTokenCookie } from './helpers/tokenCookie'
import { getDeviceIdCookie } from './helpers/deviceIdCookie'
import { API_BASE_URL } from '@repo/constants'
import { Hono } from 'hono'
import getEnv from './helpers/getEnv'
import { zValidator } from '@hono/zod-validator'
import { AdminSchema } from '@repo/validators'
import { HTTPException } from 'hono/http-exception'

export const baseRouter = new Hono()

baseRouter.post(
  `${API_BASE_URL}/set-admin`,
  zValidator('json', AdminSchema.setAdmin),
  async (c) => {
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
  }
)

baseRouter.get(`${UPLOADS.URL}/:userId/:postId/*`, async (c) => {
  const { userId, postId } = c.req.param()
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
    const uploadsPath = url.replace(UPLOADS.URL, '')
    const cleanLocation = getEnv('INTERNAL_UPLOADS_LOCATION').replaceAll(
      '/',
      ''
    )
    const modifiedUrl = `/${cleanLocation}/${uploadsPath}`

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

baseRouter.all(`${API_BASE_URL}/*`, (c) => {
  return fetchRequestHandler({
    endpoint: API_BASE_URL,
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) => createContext(opts, c)
  })
})
