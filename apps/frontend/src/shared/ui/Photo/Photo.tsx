import { forwardRef, memo, type CSSProperties } from 'react'
import PhotoLayout from '@/shared/layouts/PhotoLayout'
import cx from 'clsx'
import styles from './Photo.module.scss'
import Image from '../Image'
import Gradient from '../Gradient'

type PhotoProps = {
  src?: string
  isLoading?: boolean
  isError?: boolean
  className?: string
  mini?: boolean
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
      render = true,
      gpuAcc = true
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

    if (!src || !render || isLoading) {
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
