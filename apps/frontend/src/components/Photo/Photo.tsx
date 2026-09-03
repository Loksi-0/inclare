import Image from '@/components/Image'
import { forwardRef, memo, type CSSProperties } from 'react'
import Gradient from '../Gradient/Gradient'
import PhotoLayout from '@/layouts/PhotoLayout'
import cx from 'clsx'
import styles from './Photo.module.scss'

type PhotoProps = {
  src?: string
  isLoading?: boolean
  isError?: boolean
  className?: string
  mini?: boolean
  vertical?: boolean
  style?: CSSProperties
  render?: boolean
  gpuAcc?: boolean
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
      vertical = false,
      render = true,
      gpuAcc = true
    } = props

    if (isError) {
      return (
        <PhotoLayout
          className={className}
          style={style}
          mini={mini}
          vertical={vertical}
          ref={ref}
        >
          <div className={styles.photo__error}></div>
        </PhotoLayout>
      )
    }

    if (!src || !render || isLoading) {
      return (
        <PhotoLayout
          className={className}
          style={style}
          mini={mini}
          vertical={vertical}
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
        vertical={vertical}
        ref={ref}
      >
        <Image
          className={cx(styles.photo__image, [{ [styles.gpu]: gpuAcc }])}
          src={src}
          alt=''
          width={300}
          height={400}
        />
      </PhotoLayout>
    )
  })
)

export default Photo
