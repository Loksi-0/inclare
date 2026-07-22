'use client'

import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react'
import styles from './Avatar.module.scss'
import Button from '@/components/Button'
import Plus from '@/icons/Plus'
import Image from 'next/image'
import cx from 'clsx'
import Cross from '@/icons/Cross'

type AvatarInputProps = {
  value: File | null
  setValue: Dispatch<SetStateAction<File | null>>
  className?: string
}

const AvatarInput = (props: AvatarInputProps) => {
  const { value, setValue, className } = props

  const [imgUrl, setImgUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setImgUrl(null)
      return
    }

    if (imgUrl) {
      URL.revokeObjectURL(imgUrl)
    }

    setImgUrl(URL.createObjectURL(value))

    return () => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl)
      }
    }
  }, [value])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setValue(file)
    }
  }

  const remove = () => {
    if (imgUrl) {
      URL.revokeObjectURL(imgUrl)
    }

    setValue(null)
  }

  return (
    <div
      className={cx(styles.avatar, className, [{ [styles.selected]: imgUrl }])}
    >
      <input
        className={styles.avatar__input}
        type='file'
        accept='image/*'
        title=''
        onChange={onChange}
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
          onChange={onChange}
        />
        <Plus />
      </Button>
      {imgUrl && (
        <Button
          className={styles.avatar__delete}
          color='icon'
          onClick={remove}
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
