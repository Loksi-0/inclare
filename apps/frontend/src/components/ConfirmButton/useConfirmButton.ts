'use client'

import { useBlur } from '@/shared/hooks/useBlur'
import { effectorStore } from '@/stores/effector.store'
import gsap from 'gsap'
import { useRef, useState } from 'react'

export const useConfirmButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null)
  const rejectButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const blurIn = useBlur({ from: 0, to: 10 })
  const blurOut = useBlur({ from: 10, to: 0 })

  const setModalPosition = () => {
    if (!buttonRef.current || !modalRef.current || !effectorStore.effectorRef) {
      return
    }

    const PADDING = 10

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const modalRect = modalRef.current.getBoundingClientRect()
    const effectorRect = effectorStore.effectorRef.getBoundingClientRect()

    let modalX = buttonRect.x
    let modalY = buttonRect.y - effectorRect.y - modalRect.height - PADDING

    if (modalX + modalRect.width > window.innerWidth) {
      modalX = buttonRect.right - modalRect.width
    }

    if (modalY + effectorRect.y < 0) {
      modalY = buttonRect.y - effectorRect.y + buttonRect.height + PADDING
    }

    modalRef.current.style.left = `${modalX}px`
    modalRef.current.style.top = `${modalY}px`
  }

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
