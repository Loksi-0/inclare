import Lottie from 'react-lottie-player'
import animationData from './Preloader.json'
import cx from 'clsx'
import styles from './Preloader.module.scss'

type PreloaderProps = {
  color?: 'dark' | 'light'
  size?: number
  className?: string
}

const Preloader = (props: PreloaderProps) => {
  const { color = 'dark', size = 20, className } = props

  return (
    <Lottie
      className={cx(styles[color], className)}
      animationData={animationData}
      loop
      play
      style={{
        width: size,
        height: size
      }}
    />
  )
}

export default Preloader
