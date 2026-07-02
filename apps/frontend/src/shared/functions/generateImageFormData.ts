import { randomCode } from './randomCode'

type Options = {
  image?: File
  imageName?: string
  data?: object
}

export const generateImageFormData = (options: Options) => {
  const { image, imageName, data } = options

  const formData = new FormData()

  if (image && imageName) {
    const imageParts = image.name.split('.')
    const imageExt = imageParts[imageParts.length - 1]
    const safeName = `${randomCode(10)}.${imageExt}`

    formData.append('image', image, safeName)
    formData.append('imageName', imageName)
  }

  if (data) {
    formData.append('data', JSON.stringify(data))
  }

  return formData
}
