'use client'

import { useTRPC } from '@/api/tanstack'
import styles from './ModeratingPosts.module.scss'
import { useMutation, useQuery } from '@tanstack/react-query'
import Preloader from '@/components/Preloader'
import Image from 'next/image'
import Button from '@/components/Button'
import { postStore } from '@/stores/post.store'
import ConfirmButton from '@/components/ConfirmButton'
import { useState } from 'react'
import AuthorHeader from '@/components/AuthorHeader'
import Retry from '@/icons/Retry'

const ModeratingPosts = () => {
  const [isRemoveAndBanPending, setIsRemoveAndBanPending] = useState(false)

  const trpc = useTRPC()
  const { data, refetch } = useQuery(
    trpc.post.moderator.getModerating.queryOptions()
  )
  const { mutate: skip, isPending: isSkipPending } = useMutation(
    trpc.post.moderator.markAsViewed.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )
  const { mutateAsync: remove, isPending: isDeletePending } = useMutation(
    trpc.post.moderator.delete.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )
  const { mutateAsync: ban } = useMutation(trpc.user.setBan.mutationOptions())

  const removeAndBan = ({
    postId,
    userId
  }: {
    postId: string
    userId: string
  }) => {
    setIsRemoveAndBanPending(true)
    remove({ id: postId })
    ban(
      { id: userId, isBanned: true },
      {
        onSuccess: () => {
          setIsRemoveAndBanPending(false)
          refetch()
        }
      }
    )
  }

  if (!data) {
    return (
      <div className={styles.posts__preloader}>
        <Preloader />
      </div>
    )
  }

  if (!data.at(0)) {
    return (
      <div className={styles.posts__empty}>
        <h3>все посты просмотрены</h3>
        <Button
          className={styles.posts__retry}
          color='icon'
          onClick={() => {
            refetch()
          }}
        >
          <Retry />
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.posts}>
      {data.map((p) => (
        <div
          key={p.id}
          className={styles.posts__post}
        >
          <AuthorHeader
            className={styles.posts__header}
            isMy={false}
            clickable
            authorId={p.authorId}
            authorName={p.author.name}
            avatar={p.author.avatar}
            createdAt={p.createdAt}
          />
          <Button
            color='icon'
            onClick={() => {
              postStore.open(p.id)
            }}
          >
            <Image
              className={styles.posts__image}
              src={p.previewUrl}
              width={500}
              height={500}
              alt=''
            />
          </Button>
          {p.description && (
            <div className={styles.posts__description}>{p.description}</div>
          )}
          <div className={styles.posts__actions}>
            <Button
              color='solid'
              onClick={() => {
                skip({ id: p.id })
              }}
              loading={isSkipPending}
              animate
            >
              пропустить
            </Button>
            <div className={styles.posts__delete}>
              <ConfirmButton
                color='outlined'
                content={{
                  title: 'Удалить пост?',
                  confirm: 'удалить',
                  reject: 'отмена'
                }}
                onConfirm={() => {
                  remove({ id: p.id })
                }}
                loading={isDeletePending}
              >
                удалить
              </ConfirmButton>
              <ConfirmButton
                color='outlined'
                content={{
                  title: 'Удалить пост и забанить автора?',
                  confirm: 'удалить и забанить',
                  reject: 'отмена'
                }}
                onConfirm={() => {
                  removeAndBan({ postId: p.id, userId: p.authorId })
                }}
                loading={isRemoveAndBanPending}
              >
                удалить и забанить автора
              </ConfirmButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModeratingPosts
