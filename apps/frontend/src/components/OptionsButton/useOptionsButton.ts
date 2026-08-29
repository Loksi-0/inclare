'use client'

import { getPopupPosition } from '@/shared/functions/getPopupPosition'
import { useBlur } from '@/shared/hooks/useBlur'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

export const useOptionsButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const blurIn = useBlur({ from: 0, to: 10 })
  const blurOut = useBlur({ from: 10, to: 0 })

  const setModalPosition = () => {
    if (!buttonRef.current || !modalRef.current) {
      return
    }

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const modalRect = modalRef.current.getBoundingClientRect()

    const { popupX, popupY } = getPopupPosition({
      buttonRect,
      popupRect: modalRect
    })

    modalRef.current.style.left = `${popupX}px`
    modalRef.current.style.top = `${popupY}px`
  }

  useEffect(() => {
    setModalPosition()
  }, [])

  const open = () => {
    setModalPosition()
    setIsOpen(true)
    cancelButtonRef.current?.focus()

    blurOut(modalRef.current)
    gsap.to(modalRef.current, {
      opacity: 1,
      duration: 0.2
    })
  }

  const close = () => {
    setIsOpen(false)
    blurIn(modalRef.current)
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.2
    })
  }

  return {
    isOpen,
    modalRef,
    buttonRef,
    cancelButtonRef,
    open,
    close
  }
}
