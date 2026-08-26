import Image from 'next/image'
import { forwardRef, memo, type CSSProperties } from 'react'
import Gradient from '../Gradient/Gradient'
import PhotoLayout from '@/layouts/PhotoLayout'
import styles from './Photo.module.scss'

type PhotoProps = {
  src?: string
  isLoading?: boolean
  isError?: boolean
  className?: string
  mini?: boolean
  style?: CSSProperties
  unoptimized?: boolean
}

const Photo = memo(
  forwardRef<HTMLDivElement, PhotoProps>((props, ref) => {
    const {
      src,
      isLoading,
      isError,
      className,
      style,
      mini = false,
      unoptimized = false
    } = props

    if (isError) {
      return (
        <PhotoLayout
          className={className}
          style={style}
          mini={mini}
          ref={ref}
        >
          <div className={styles.photo__error}></div>
        </PhotoLayout>
      )
    }

    if (!src || isLoading) {
      return (
        <PhotoLayout
          className={className}
          style={style}
          mini={mini}
          ref={ref}
        >
          <Gradient />
        </PhotoLayout>
      )
    }

    return (
      <PhotoLayout
        className={className}
        style={style}
        mini={mini}
        ref={ref}
      >
        <Image
          className={styles.photo__image}
          src={src}
          alt=''
          width={200}
          height={250}
          draggable={false}
          loading='lazy'
          decoding='async'
          unoptimized={unoptimized}
        />
      </PhotoLayout>
    )
  })
)

export default Photo
