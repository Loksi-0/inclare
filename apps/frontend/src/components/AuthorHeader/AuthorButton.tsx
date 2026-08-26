'use client'

import Button from '../Button'
import { postStore } from '@/stores/post.store'
import type { PropsWithChildren } from 'react'
import { PAGES } from '@/constants'

type AuthorButtonProps = PropsWithChildren<{
  authorId: string
  clickable: boolean
  className?: string
}>

const AuthorButton = (props: AuthorButtonProps) => {
  const { authorId, clickable, className, children } = props

  if (!clickable) {
    return <div className={className}>{children}</div>
  }

  return (
    <Button
      className={className}
      color='icon'
      navigate={PAGES.USER(authorId)}
      onClick={() => {
        postStore.closeInstantly()
      }}
    >
      {children}
    </Button>
  )
}

export default AuthorButton
