import sharp from 'sharp'

type Options = {
  width: number | null
  height: number | null
  img: string | Buffer
  output: string
  fit?: keyof sharp.FitEnum
  animated?: boolean
  orientation?: number
}

export const compressWebp = async (options: Options) => {
  await sharp(options.img, { animated: options.animated })
    .withMetadata(
      options.orientation ? { orientation: options.orientation } : undefined
    )
    .rotate()
    .resize(options.width, options.height, {
      fit: options.fit
    })
    .webp({
      effort: 4,
      quality: 80
    })
    .toFile(options.output)
}
