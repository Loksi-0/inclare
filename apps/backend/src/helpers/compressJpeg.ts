import sharp from 'sharp'

type Options = {
  width: number | null
  height: number | null
  img: string | Buffer
  output: string
  fit?: keyof sharp.FitEnum
  orientation?: number
}

export const compressJpeg = async (options: Options) => {
  await sharp(options.img)
    .withMetadata(
      options.orientation ? { orientation: options.orientation } : undefined
    )
    .rotate()
    .resize(options.width, options.height, {
      fit: options.fit
    })
    .jpeg({
      progressive: true,
      quality: 85
    })
    .toFile(options.output)
}
