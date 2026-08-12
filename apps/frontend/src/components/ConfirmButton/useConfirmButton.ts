'use client'

import { effectorStore } from '@/stores/effector.store'
import gsap from 'gsap'
import { useRef, useState } from 'react'

export const useConfirmButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null)
  const rejectButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const openTransitionRef = useRef({ blur: 10, opacity: 0 })
  const closeTransitionRef = useRef({ blur: 0, opacity: 1 })

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

    gsap.to(openTransitionRef.current, {
      blur: 0,
      opacity: 1,
      duration: 0.2,
      onUpdate: () => {
        if (!modalRef.current) {
          return
        }

        modalRef.current.style.filter = `blur(${openTransitionRef.current.blur}px)`
        modalRef.current.style.opacity = String(
          openTransitionRef.current.opacity
        )
      },
      onComplete: () => {
        openTransitionRef.current = { blur: 10, opacity: 0 }
      }
    })
  }

  const close = () => {
    setIsOpen(false)
    gsap.to(closeTransitionRef.current, {
      blur: 10,
      opacity: 0,
      duration: 0.2,
      onUpdate: () => {
        if (!modalRef.current) {
          return
        }

        modalRef.current.style.filter = `blur(${closeTransitionRef.current.blur}px)`
        modalRef.current.style.opacity = String(
          closeTransitionRef.current.opacity
        )
      },
      onComplete: () => {
        closeTransitionRef.current = { blur: 0, opacity: 1 }
      }
    })
  }

  return {
    isOpen,
    modalRef,
    buttonRef,
    confirmButtonRef,
    rejectButtonRef
  }
}
