import PhotoLayout from '@/shared/layouts/PhotoLayout'
import Image from '@/shared/ui/Image'
import Like from '@/features/like'
import Button from '@/shared/ui/Button'
import { memo, type CSSProperties } from 'react'
import cx from 'clsx'
import styles from './LikePhoto.module.scss'

type LikePhotoProps = {
  postId: string
  src: string
  color: string
  likes?: number
  isLiked?: boolean
  onOpen?: (id: string) => void
  style?: CSSProperties
  className?: string
}

const LikePhoto = memo((props: LikePhotoProps) => {
  const { postId, src, color, likes, isLiked, onOpen, style, className } = props

  return (
    <PhotoLayout
      style={style}
      className={cx(styles.photo, className)}
    >
      <Button
        className={styles.photo__button}
        color='icon'
        onClick={() => {
          onOpen?.(postId)
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

export default LikePhoto
