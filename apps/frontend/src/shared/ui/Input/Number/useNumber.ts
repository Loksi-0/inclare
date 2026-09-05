'use client'

import { useId, type ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAutoAnimate } from '@/shared/hooks/useAutoAnimate'

type UseNumberProps = {
  min?: number
  max?: number
  error?: string
}

export const useNumber = ({ min, max, error }: UseNumberProps) => {
  const id = useId()
  const inputRef = useAutoAnimate([error], { width: false })
  const { control } = useFormContext()

  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: (...event: any[]) => void
  ) => {
    const val = e.target.value

    if (!/^-?\d*$/.test(val)) {
      return
    }

    const intVal = Number(val)
    if (
      (typeof max === 'number' && intVal > max) ||
      (typeof min === 'number' && intVal < min)
    ) {
      return
    }

    setValue(intVal)
  }

  return {
    inputRef,
    id,
    control,
    onChange
  }
}
