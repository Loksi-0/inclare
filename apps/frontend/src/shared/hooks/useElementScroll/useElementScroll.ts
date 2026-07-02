'use client'

import styles from './highlight.module.scss'

export const useElementScroll = () => {
  const scrollTo = (id: string) => {
    const element = document.querySelector<HTMLElement>(`[data-js-id="${id}"]`) // for correct work, element must have data-js-id attribute

    if (!element) {
      return
    }

    element.scrollIntoView({ block: 'center', behavior: 'smooth' })
    element.classList.add(styles.highlight)

    setTimeout(() => {
      element.classList.remove(styles.highlight)
    }, 2000)

    return element
  }

  return {
    scrollTo
  }
}
