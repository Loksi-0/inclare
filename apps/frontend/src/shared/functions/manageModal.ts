import { inertStore } from '@/shared/stores/inert.store'
import type { Dispatch, SetStateAction } from 'react'

export const openModal = (setIsOpen?: Dispatch<SetStateAction<boolean>>) => {
  inertStore.setInert(true)
  document.documentElement.classList.add('is-lock')
  setIsOpen?.(true)
}

export const closeModal = (setIsOpen?: Dispatch<SetStateAction<boolean>>) => {
  inertStore.setInert(false)
  document.documentElement.classList.remove('is-lock')
  setIsOpen?.(false)
}
