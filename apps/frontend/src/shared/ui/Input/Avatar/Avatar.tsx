'use client'

import Button from '@/shared/ui/Button'
import Plus from '@/shared/icons/Plus'
import Image from '@/shared/ui/Image'
import cx from 'clsx'
import Cross from '@/shared/icons/Cross'
import { useAvatar, type AvatarInputProps } from './useAvatar'
import Pencil from '@/shared/icons/Pencil'
import styles from './Avatar.module.scss'

const AvatarInput = (props: AvatarInputProps) => {
  const { className, onChange: extOnChange } = props

  const { imgUrl, onChange, remove } = useAvatar(props)

  return (
    <div
      className={cx(styles.avatar, className, [{ [styles.selected]: imgUrl }])}
    >
      <input
        className={styles.avatar__input}
        type='file'
        accept='image/*'
        title=''
        onChange={(e) => {
          extOnChange?.()
          onChange(e)
        }}
      />
      <Button
        className={styles.avatar__add}
        color='icon'
      >
        <input
          className={styles.avatar__input}
          type='file'
          accept='image/*'
          title=''
          onChange={(e) => {
            extOnChange?.()
            onChange(e)
          }}
        />
        {imgUrl ? <Pencil /> : <Plus />}
      </Button>
      {imgUrl && (
        <Button
          className={styles.avatar__delete}
          color='icon'
          onClick={() => {
            extOnChange?.()
            remove()
          }}
        >
          <Cross />
        </Button>
      )}
      {imgUrl && (
        <Image
          className={styles.avatar__preview}
          src={imgUrl}
          width={300}
          height={300}
          unoptimized
        />
      )}
    </div>
  )
}

export default AvatarInput
