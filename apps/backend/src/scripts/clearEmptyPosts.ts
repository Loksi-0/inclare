import { prisma } from '@backend/context'
import cron from 'node-cron'
import fs from 'fs/promises'
import { POST } from '@backend/constants'

cron.schedule('*/10 * * * *', async () => {
  const candidates = await prisma.post.findMany({
    where: {
      photos: {
        none: {}
      }
    }
  })

  for (const c of candidates) {
    await prisma.post.delete({ where: { id: c.id } })
    await fs.rm(POST.PATH(c.authorId, c.id), { recursive: true, force: true })
  }
})
