import cx from 'clsx'
import styles from './Toast.module.scss'

type ToastProps = {
  id: string | number
  title: string
  type: 'error' | 'message'
  description?: string
  button?: {
    label: string
    onClick: () => void
  }
}

const Toast = ({ title, type }: ToastProps) => {
  return <div className={cx(styles.toast, styles[type])}>{title}</div>
}

export default Toast
