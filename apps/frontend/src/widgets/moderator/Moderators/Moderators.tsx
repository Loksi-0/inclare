'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import styles from './Moderators.module.scss'
import { useTRPC } from '@/api/tanstack'
import Preloader from '@/components/Preloader'
import Button from '@/components/Button'
import UserCard from '@/components/UserCard/UserCard'

const Moderators = () => {
  const trpc = useTRPC()
  const { data: moderators, refetch } = useQuery(
    trpc.admin.getModerators.queryOptions()
  )
  const { mutate: setIsModerator, isPending: isModeratorPending } = useMutation(
    trpc.admin.setIsModerator.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )
  const { mutate: setIsBan, isPending: isBanPending } = useMutation(
    trpc.user.setBan.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )

  if (!moderators) {
    return <Preloader />
  }

  if (!moderators.at(0)) {
    return <div className={styles.moderators__empty}>модераторов нет</div>
  }

  return (
    <div className={styles.moderators}>
      {moderators.map((m) => (
        <UserCard
          key={m.id}
          userId={m.id}
          avatar={m.avatar}
          name={m.name}
          email={m.email}
        >
          <Button
            color='solid'
            onClick={() => {
              setIsModerator({ id: m.id, isModerator: false })
            }}
            loading={isModeratorPending}
            animate
          >
            снять с модераторства
          </Button>
          <Button
            color='outlined'
            onClick={() => {
              setIsBan({ id: m.id, isBanned: true })
            }}
            loading={isBanPending}
            animate
          >
            забанить
          </Button>
        </UserCard>
      ))}
    </div>
  )
}

export default Moderators
