import type { ComponentProps, PropsWithChildren } from 'react'
import styles from './FileInputButton.module.scss'
import Button from '../Button'
import cx from 'clsx'

type FileInputButtonProps = PropsWithChildren<{
  color: ComponentProps<typeof Button>['color']
  onInput: (files: FileList | null) => void | Promise<void>
  loading?: boolean
  accept?: string
  className?: string
  animate?: boolean
}>

const FileInputButton = (props: FileInputButtonProps) => {
  const {
    color,
    children,
    onInput,
    loading,
    accept,
    className,
    animate = false
  } = props

  return (
    <Button
      className={cx(styles.button, className)}
      color={color}
      loading={loading}
      animate={animate}
    >
      <input
        className={styles.button__input}
        type='file'
        multiple
        onChange={(e) => {
          onInput(e.target.files)
        }}
        accept={accept}
        title=''
      />
      {children}
    </Button>
  )
}

export default FileInputButton
