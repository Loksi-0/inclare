'use client'

import { useNavigate } from '@/shared/hooks/useNavigate'
import Button from '../Button'
import styles from './ViewPost.module.scss'
import { postStore } from '@/stores/post.store'
import type { PropsWithChildren } from 'react'
import { PAGES } from '@/constants'

type AuthorButtonProps = PropsWithChildren<{
  authorId: string
  clickable: boolean
}>

const AuthorButton = (props: AuthorButtonProps) => {
  const { authorId, clickable, children } = props

  const { push } = useNavigate()

  if (!clickable) {
    return <div className={styles.post__author}>{children}</div>
  }

  return (
    <Button
      className={styles.post__author}
      color='icon'
      onClick={() => {
        push(PAGES.USER(authorId))
        postStore.closeInstantly()
      }}
    >
      {children}
    </Button>
  )
}

export default AuthorButton
