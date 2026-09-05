'use client'

import { forwardRef, useEffect, useState } from 'react'
import { randomInt } from '@/shared/functions/randomInt'
import cx from 'clsx'
import styles from './DecorationBlock.module.scss'

type DecorationBlockProps = {
  deps: unknown[]
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const DecorationBlock = forwardRef<HTMLDivElement, DecorationBlockProps>(
  (props, ref) => {
    const { deps, position } = props

    const [element, setElement] = useState('')

    const generateElement = () => {
      const elements = ['▙', '▚', '▛', '▜', '▝', '▞', '▟']

      const prevIndex = elements.indexOf(element)

      if (prevIndex !== -1) {
        elements.splice(prevIndex, 1)
      }

      setElement(elements[randomInt(0, elements.length - 1)])
    }

    useEffect(generateElement, [])
    useEffect(generateElement, deps)

    if (!element) {
      return <div ref={ref}></div>
    }

    return (
      <div
        ref={ref}
        className={cx(styles.block, styles[position])}
      >
        {element}
      </div>
    )
  }
)

export default DecorationBlock
