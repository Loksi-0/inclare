import cx from 'clsx'
import styles from './Skeleton.module.scss'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
}

const Skeleton = (props: SkeletonProps) => {
  const { width, height, className } = props

  return (
    <div
      className={cx(styles.skeleton, className)}
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: typeof height === 'string' ? height : `${height}px`
      }}
    ></div>
  )
}

export default Skeleton
