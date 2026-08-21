'use client'

import { useBlur } from '@/shared/hooks/useBlur'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

export const useConfirmButton = () => {
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

    const PADDING = 10

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const modalRect = modalRef.current.getBoundingClientRect()

    let modalX = 0
    let modalY = (modalRect.height + PADDING) * -1

    if (buttonRect.x + modalRect.width > window.innerWidth) {
      modalX = buttonRect.width - modalRect.width
    }

    if (buttonRect.y < modalRect.height + PADDING) {
      modalY = buttonRect.height + PADDING
    }

    modalRef.current.style.left = `${modalX}px`
    modalRef.current.style.top = `${modalY}px`
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
