import sharp from 'sharp'

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

export const compressImage = async (
  format: 'webp' | 'avif' | 'jpeg',
  options: Options
) => {
  if (format === 'webp') {
    await compressWebp(options)
    return
  } else if (format === 'avif') {
    await compressAvif(options)
    return
  }

  await compressJpeg(options)
}
