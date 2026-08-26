'use client'

import { useTRPC } from '@/api/tanstack'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Preloader from '@/components/Preloader'
import UserCard from '@/components/UserCard/UserCard'
import Button from '@/components/Button'
import type { Role } from '@db/enums'
import styles from './Users.module.scss'

const Users = ({ role, myEmail }: { role: Role; myEmail: string }) => {
  const [query, setQuery] = useState('')

  const trpc = useTRPC()
  const { data, refetch } = useQuery(trpc.user.findMany.queryOptions({ query }))
  const { mutate: setBan, isPending: isBanPending } = useMutation(
    trpc.user.setBan.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )
  const { mutate: setIsModerator, isPending: isModeratorPending } = useMutation(
    trpc.admin.setIsModerator.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )

  return (
    <div className={styles.users}>
      <input
        className={styles.users__input}
        placeholder='ник, почта или айди'
        onChange={(e) => {
          setQuery(e.target.value.trim())
        }}
      />
      <div className={styles.users__body}>
        {data ? (
          data.map(
            (u) =>
              u.email !== myEmail && (
                <UserCard
                  userId={u.id}
                  key={u.id}
                  avatar={u.avatar}
                  name={u.name}
                  email={u.email}
                >
                  <Button
                    color='solid'
                    onClick={() => {
                      setBan({ id: u.id, isBanned: !u.isBanned })
                    }}
                    loading={isBanPending}
                    animate
                  >
                    {u.isBanned ? 'разбанить' : 'забанить'}
                  </Button>
                  {role === 'ADMIN' && (
                    <Button
                      color='outlined'
                      onClick={() => {
                        setIsModerator({
                          id: u.id,
                          isModerator: !(u.role === 'MODERATOR')
                        })
                      }}
                      loading={isModeratorPending}
                      animate
                    >
                      {u.role === 'MODERATOR'
                        ? 'снять с модераторства'
                        : 'назначить модератором'}
                    </Button>
                  )}
                </UserCard>
              )
          )
        ) : (
          <div className={styles.users__preloader}>
            <Preloader />
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
