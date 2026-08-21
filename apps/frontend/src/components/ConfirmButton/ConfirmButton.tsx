'use client'

import { type ComponentProps, type PropsWithChildren } from 'react'
import Button from '../Button'
import styles from './ConfirmButton.module.scss'
import cx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useConfirmButton } from './useConfirmButton'

type ConfirmButtonProps = PropsWithChildren<{
  color: ComponentProps<typeof Button>['color']
  content: {
    title: string
    confirm: string
    reject: string
  }
  onConfirm: (close: () => void) => void | Promise<void>
  loading?: boolean
}>

const ConfirmButton = observer((props: ConfirmButtonProps) => {
  const { children, color, content, onConfirm, loading = false } = props

  const {
    isOpen,
    modalRef,
    buttonRef,
    confirmButtonRef,
    rejectButtonRef,
    open,
    close
  } = useConfirmButton()

  return (
    <div className={styles.modal__wrapper}>
      <div
        className={cx(styles.modal, [{ [styles.open]: isOpen }])}
        ref={modalRef}
      >
        <h3>{content.title}</h3>
        <div className={styles.modal__buttons}>
          <Button
            tabindex={isOpen ? 0 : -1}
            ref={confirmButtonRef}
            color='solid'
            onClick={() => {
              onConfirm(() => {
                close()
              })
            }}
            loading={loading}
          >
            {content.confirm}
          </Button>
          <Button
            tabindex={isOpen ? 0 : -1}
            ref={rejectButtonRef}
            color='outlined'
            onClick={close}
          >
            {content.reject}
          </Button>
        </div>
      </div>
      <Button
        ref={buttonRef}
        color={color}
        onClick={() => {
          if (isOpen) {
            close()
          } else {
            open()
          }
        }}
      >
        {children}
      </Button>
    </div>
  )
})

export default ConfirmButton
