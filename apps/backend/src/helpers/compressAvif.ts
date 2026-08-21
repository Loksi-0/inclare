import sharp from 'sharp'

type Options = {
  width: number | null
  height: number | null
  img: string | Buffer
  output: string
  fit?: keyof sharp.FitEnum
  orientation?: number
}

export const compressAvif = async (options: Options) => {
  await sharp(options.img)
    .withMetadata(
      options.orientation ? { orientation: options.orientation } : undefined
    )
    .rotate()
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
