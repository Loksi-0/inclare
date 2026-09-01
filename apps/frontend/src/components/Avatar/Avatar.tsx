import Image from '@/components/Image'
import cx from 'clsx'
import styles from './Avatar.module.scss'
import Button from '../Button'
import { imageModalStore } from '@/stores/imageModal.store'

type AvatarProps = {
  src: string | null
  width: number
  height: number
  expandable?: boolean
  className?: string
}

const Avatar = (props: AvatarProps) => {
  const { src, width, height, className, expandable = false } = props

  if (!src) {
    return <div className={cx(styles.skeleton, className)}></div>
  }

  if (expandable) {
    return (
      <Button
        color='icon'
        className={styles.avatar__button}
        onClick={() => {
          imageModalStore.open(src)
        }}
      >
        <Image
          className={cx(styles.avatar, className)}
          src={src}
          width={width}
          height={height}
        />
      </Button>
    )
  }

  return (
    <Image
      className={cx(styles.avatar, className)}
      src={src}
      width={width}
      height={height}
    />
  )
}

export default Avatar
