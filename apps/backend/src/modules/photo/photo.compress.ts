import sharp from 'sharp'
import { Queue, QueueEvents, Worker } from 'bullmq'
import { BULLMQ } from '@backend/constants'
import { bullConnection } from '@backend/context'

type Format = 'webp' | 'avif' | 'jpeg'
type Options = {
  width: number | null
  height: number | null
  img: string | Buffer
  output: string
  fit?: keyof sharp.FitEnum
  animated?: boolean
  angle?: number
}

const compressWebp = async (options: Options) => {
  await sharp(options.img, { animated: options.animated })
    .rotate(options.angle)
    .resize(options.width, options.height, {
      fit: options.fit
    })
    .webp({
      effort: 4,
      quality: 80
    })
    .toFile(options.output)
}

const compressJpeg = async (options: Options) => {
  await sharp(options.img)
    .rotate(options.angle)
    .resize(options.width, options.height, {
      fit: options.fit
    })
    .jpeg({
      progressive: true,
      quality: 85
    })
    .toFile(options.output)
}

const compressAvif = async (options: Options) => {
  await sharp(options.img, { animated: options.animated })
    .rotate(options.angle)
    .resize(options.width, options.height, {
      fit: options.fit
    })
    .avif({
      quality: 45,
      effort: 4,
      chromaSubsampling: '4:2:0'
    })
    .toFile(options.output)
}

type CompressJob = {
  format: Format
  options: Options
}

const compressQueue = new Queue(BULLMQ.QUEUES.COMPRESS, {
  connection: bullConnection
})
const compressEvents = new QueueEvents(BULLMQ.QUEUES.COMPRESS)
new Worker<CompressJob>(
  BULLMQ.QUEUES.COMPRESS,
  async ({ name, data }) => {
    if (name === BULLMQ.NAMES.COMPRESS) {
      if (data.format === 'webp') {
        await compressWebp(data.options)
        return
      } else if (data.format === 'avif') {
        await compressAvif(data.options)
        return
      }

      await compressJpeg(data.options)
    }
  },
  { connection: bullConnection }
)

export const compressImage = async (format: Format, options: Options) => {
  const job = await compressQueue.add(BULLMQ.NAMES.COMPRESS, {
    format,
    options
  })

  await job.waitUntilFinished(compressEvents)
}
