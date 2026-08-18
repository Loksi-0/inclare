'use client'

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react'

export type AvatarInputProps = {
  value: File | null
  setValue: Dispatch<SetStateAction<File | null>>
  initialSrc?: string | null
  className?: string
  onChange?: () => void
}

export const useAvatar = (props: AvatarInputProps) => {
  const { value, setValue, initialSrc } = props

  const wasChanged = useRef(false)
  const [imgUrl, setImgUrl] = useState<string | null>(initialSrc || null)

  useEffect(() => {
    setImgUrl(initialSrc || null)
  }, [initialSrc])

  useEffect(() => {
    if (!value) {
      setImgUrl(wasChanged.current ? null : initialSrc || null)
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

    wasChanged.current = true
    setValue(null)
    setImgUrl(null)
  }

  return {
    imgUrl,
    onChange,
    remove
  }
}
