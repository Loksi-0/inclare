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

const compressJob = async ({ format, options }: CompressJob) => {
  if (format === 'webp') {
    await compressWebp(options)
    return
  } else if (format === 'avif') {
    await compressAvif(options)
    return
  }

  await compressJpeg(options)
}
const compressQueue = new Queue(BULLMQ.QUEUES.COMPRESS, {
  connection: bullConnection
})
const compressEvents = new QueueEvents(BULLMQ.QUEUES.COMPRESS, {
  connection: bullConnection
})
new Worker<CompressJob>(
  BULLMQ.QUEUES.COMPRESS,
  async ({ name, data }) => {
    try {
      if (name === BULLMQ.NAMES.COMPRESS) {
        await compressJob(data)
      }
    } catch (e) {
      console.log(e)
    }
  },
  { connection: bullConnection }
)

export const compressImage = async (format: Format, options: Options) => {
  if (typeof options.img === 'string') {
    const job = await compressQueue.add(BULLMQ.NAMES.COMPRESS, {
      format,
      options
    })

    await job.waitUntilFinished(compressEvents)
  } else {
    await compressJob({ format, options })
  }
}
