import Image from 'next/image'
import cx from 'clsx'
import styles from './Photo.module.scss'
import { forwardRef, type CSSProperties, type PropsWithChildren } from 'react'
import Gradient from '../Gradient/Gradient'

type PhotoProps = {
  src?: string
  isLoading?: boolean
  isError?: boolean
  className?: string
  mini?: boolean
  style?: CSSProperties
}

const Photo = forwardRef<HTMLDivElement, PhotoProps>((props, ref) => {
  const { src, isLoading, isError, className, style, mini = false } = props

  const PhotoLayout = ({ children }: PropsWithChildren) => (
    <div
      ref={ref}
      className={cx(styles.photo, className, [{ [styles.mini]: mini }])}
      style={style}
    >
      {children}
    </div>
  )

  if (isError) {
    return (
      <PhotoLayout>
        <div className={styles.photo__error}></div>
      </PhotoLayout>
    )
  }

  if (!src || isLoading) {
    return (
      <PhotoLayout>
        <Gradient />
      </PhotoLayout>
    )
  }

  return (
    <PhotoLayout>
      <Image
        className={styles.photo__image}
        src={src}
        alt=''
        width={200}
        height={250}
        draggable={false}
        loading='lazy'
        decoding='async'
      />
    </PhotoLayout>
  )
})

export default Photo
