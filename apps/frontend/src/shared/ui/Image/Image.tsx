import { CACHE_IMAGE_QUERIES } from '@repo/constants'
import {
  forwardRef,
  useMemo,
  type DetailedHTMLProps,
  type ImgHTMLAttributes
} from 'react'

type ImageProps = {
  src: string
  width: number
  height: number
  draggable?: boolean
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
  className?: string
  alt?: string
  unoptimized?: boolean
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

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
    unoptimized = false,
    ...rest
  } = props

  const cacheSrc = useMemo(() => {
    return `${src}?${CACHE_IMAGE_QUERIES.WIDTH}=${width}&${CACHE_IMAGE_QUERIES.HEIGHT}=${height}`
  }, [src, width, height])

  return (
    <img
      ref={ref}
      src={unoptimized ? src : cacheSrc}
      draggable={draggable}
      loading={loading}
      decoding={decoding}
      alt={alt}
      className={className}
      {...rest}
    />
  )
})

export default Image
