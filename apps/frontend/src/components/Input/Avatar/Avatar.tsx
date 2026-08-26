'use client'

import Button from '@/components/Button'
import Plus from '@/icons/Plus'
import Image from 'next/image'
import cx from 'clsx'
import Cross from '@/icons/Cross'
import { useAvatar, type AvatarInputProps } from './useAvatar'
import Pencil from '@/icons/Pencil'
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
          width={120}
          height={120}
          alt=''
        />
      )}
    </div>
  )
}

export default AvatarInput
