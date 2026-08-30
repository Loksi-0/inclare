import Image from '@/components/Image'
import cx from 'clsx'
import styles from './Avatar.module.scss'

type AvatarProps = {
  src: string | null
  width: number
  height: number
  className?: string
}

const Avatar = (props: AvatarProps) => {
  const { src, width, height, className } = props

  if (!src) {
    return <div className={cx(styles.skeleton, className)}></div>
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
