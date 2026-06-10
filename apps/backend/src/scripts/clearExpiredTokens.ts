import { prisma } from '@/context'
import cron from 'node-cron'

cron.schedule('0 3 * * *', async () => {
  await prisma.token.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
})
