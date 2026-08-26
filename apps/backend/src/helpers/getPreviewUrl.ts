export const getPreviewUrl = (
  photos: { order: number; optimizedUrl: string }[]
) => {
  return photos.at(0)
    ? photos.reduce((prev, current) =>
        prev.order < current.order ? prev : current
      ).optimizedUrl
    : undefined
}
