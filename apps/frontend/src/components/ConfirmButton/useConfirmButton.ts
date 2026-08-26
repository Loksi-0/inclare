'use client'

import { useBlur } from '@/shared/hooks/useBlur'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

export const useConfirmButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null)
  const rejectButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const blurIn = useBlur({ from: 0, to: 10 })
  const blurOut = useBlur({ from: 10, to: 0 })

  const setModalPosition = () => {
    if (!buttonRef.current || !modalRef.current) {
      return
    }

    const PADDING = 10
    const MARGIN = 50

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const modalRect = modalRef.current.getBoundingClientRect()

    let modalX = 0
    let modalY = (modalRect.height + PADDING) * -1

    if (buttonRect.x + modalRect.width + MARGIN > window.innerWidth) {
      modalX = buttonRect.width - modalRect.width
    }

    if (buttonRect.y < modalRect.height + MARGIN + PADDING) {
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
    rejectButtonRef.current?.focus()

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
    confirmButtonRef,
    rejectButtonRef,
    open,
    close
  }
}
