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
    const imageExt = image.name.split('.').at(-1)
    const safeName = `${randomCode(10)}.${imageExt || 'jpg'}`

    formData.append('image', image, safeName)
    formData.append('imageName', imageName)
  }

  if (data) {
    formData.append('data', JSON.stringify(data))
  }

  return formData
}
