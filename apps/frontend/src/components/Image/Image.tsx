import { CACHE_IMAGE_QUERIES } from '@repo/constants'
import { forwardRef, useMemo } from 'react'

type ImageProps = {
  src: string
  width: number
  height: number
  draggable?: boolean
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
  className?: string
  alt?: string
  onLoad?: () => void
}

const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    src,
    width,
    height,
    draggable = false,
    loading = 'lazy',
    decoding = 'async',
    alt = '',
    className,
    onLoad
  } = props

  const cacheSrc = useMemo(() => {
    return `${src}?${CACHE_IMAGE_QUERIES.WIDTH}=${width}&${CACHE_IMAGE_QUERIES.HEIGHT}=${height}`
  }, [src, width, height])

  return (
    <img
      ref={ref}
      src={cacheSrc}
      draggable={draggable}
      loading={loading}
      decoding={decoding}
      alt={alt}
      className={className}
      onLoad={onLoad}
    />
  )
})

export default Image
