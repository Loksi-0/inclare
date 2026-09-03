import { Hono } from 'hono'
import { prisma } from '@backend/context'
import getEnv from '@backend/shared/getEnv'
import { zValidator } from '@hono/zod-validator'
import { AdminSchema } from '@repo/validators'
import { HTTPException } from 'hono/http-exception'

export const rest = new Hono()

rest.post(`/set-admin`, zValidator('json', AdminSchema.setAdmin), async (c) => {
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
