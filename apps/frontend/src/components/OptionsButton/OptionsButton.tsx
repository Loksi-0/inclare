'use client'

import { type ComponentProps, type PropsWithChildren } from 'react'
import Button from '../Button'
import styles from './OptionsButton.module.scss'
import cx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useConfirmButton } from './useOptionsButton'

type OptionsButtonProps = PropsWithChildren<{
  color: ComponentProps<typeof Button>['color']
  title?: string
  data: {
    title: string
    onClick: (close: () => void) => void | Promise<void>
    color?: ComponentProps<typeof Button>['color']
    loading?: boolean
  }[]
}>

const OptionsButton = observer((props: OptionsButtonProps) => {
  const { children, color, title, data } = props

  const { isOpen, modalRef, buttonRef, cancelButtonRef, open, close } =
    useConfirmButton()

  return (
    <div className={styles.modal__wrapper}>
      <div
        className={cx(styles.modal, [{ [styles.open]: isOpen }])}
        ref={modalRef}
      >
        {title && <h3>{title}</h3>}
        <div className={styles.modal__buttons}>
          {data.map((b, i) => (
            <Button
              key={`${b.title}-${i}`}
              tabindex={isOpen ? 0 : -1}
              ref={cancelButtonRef}
              color={b.color || 'solid'}
              onClick={() => {
                b.onClick(() => {
                  close()
                })
              }}
              loading={b.loading}
            >
              {b.title}
            </Button>
          ))}
          <Button
            tabindex={isOpen ? 0 : -1}
            ref={cancelButtonRef}
            color='outlined'
            onClick={close}
          >
            закрыть
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

export default OptionsButton
