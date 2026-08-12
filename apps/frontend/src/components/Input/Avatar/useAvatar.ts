'use client'

import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react'

type UseAvatarProps = {
  value: File | null
  setValue: Dispatch<SetStateAction<File | null>>
}

export const useAvatar = ({ value, setValue }: UseAvatarProps) => {
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

  return {
    imgUrl,
    onChange,
    remove
  }
}
