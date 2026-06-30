import sharp from 'sharp'

type Options = {
  width: number | null
  height: number | null
  img: string | Buffer
  output: string
}

export const compressJpeg = async (options: Options) => {
  await sharp(options.img)
    .rotate()
    .resize(options.width, options.height)
    .jpeg({
      progressive: true,
      quality: 85
    })
    .toFile(options.output)
}
