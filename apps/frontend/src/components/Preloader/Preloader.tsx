import Lottie from 'react-lottie-player'
import animationData from '@/shared/animations/Preloader.json'
import styles from './Preloader.module.scss'

type PreloaderProps = {
  color?: 'dark' | 'light'
  size?: number
}

const Preloader = (props: PreloaderProps) => {
  const { color = 'dark', size = 20 } = props

  return (
    <Lottie
      className={styles[color]}
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
