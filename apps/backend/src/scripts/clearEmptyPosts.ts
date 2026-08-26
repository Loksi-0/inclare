import { prisma } from '@backend/context'
import cron from 'node-cron'

cron.schedule('*/10 * * * *', async () => {
  await prisma.post.deleteMany({
    where: {
      photos: {
        none: {}
      }
    }
  })
})
