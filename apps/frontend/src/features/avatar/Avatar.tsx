import cx from 'clsx'
import Image from '@/shared/ui/Image'
import { imageModalStore } from '../imageModal'
import Button from '@/shared/ui/Button'
import styles from './Avatar.module.scss'

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
