import PhotoLayout from '@/layouts/PhotoLayout'
import Image from '@/components/Image'
import Like from '@/components/Like'
import Button from '@/components/Button'
import { memo, type CSSProperties } from 'react'
import cx from 'clsx'
import styles from './PlanePhoto.module.scss'

type PlanePhotoProps = {
  postId: string
  src: string
  color: string
  likes?: number
  isLiked?: boolean
  onClick?: (id: string) => void
  style?: CSSProperties
  className?: string
}

const PlanePhoto = memo((props: PlanePhotoProps) => {
  const {
    postId,
    src,
    color,
    likes,
    isLiked,
    onClick,
    style,
    className
  } = props

  return (
    <PhotoLayout
      style={style}
      className={cx(styles.photo, className)}
    >
      <Button
        className={styles.photo__button}
        color='icon'
        onClick={() => {
          onClick?.(postId)
        }}
      >
        <Image
          className={styles.photo__image}
          src={src}
          width={200}
          height={250}
        />
      </Button>
      <Like
        className={styles.photo__like}
        postId={postId}
        color={color}
        likes={likes}
        isLiked={isLiked}
      />
    </PhotoLayout>
  )
})

export default PlanePhoto
