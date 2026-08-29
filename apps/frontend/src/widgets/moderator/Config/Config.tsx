'use client'

import { useTRPC } from '@/api/tanstack'
import { useMutation, useQuery } from '@tanstack/react-query'
import Preloader from '@/components/Preloader'
import styles from './Config.module.scss'
import Button from '@/components/Button'

const Config = () => {
  const trpc = useTRPC()
  const { data: config, refetch } = useQuery(
    trpc.admin.getConfig.queryOptions()
  )
  const { mutate: setGravity, isPending: isGravityPendig } = useMutation(
    trpc.admin.setAlgorithmGravity.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )
  const { mutate: setFallingStarK, isPending: isStarPending } = useMutation(
    trpc.admin.setFallingStarCoefficient.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )
  const { mutate: setIntervals, isPending: isIntervalPending } = useMutation(
    trpc.admin.setFallingStarIntervals.mutationOptions({
      onSuccess: () => {
        refetch()
      }
    })
  )
  const { mutate: spawnPixel, isPending: isPixelPending } = useMutation(
    trpc.admin.spawnFallingStar.mutationOptions()
  )

  if (!config) {
    return <Preloader />
  }

  const distConfig = [
    {
      title: 'Gravity',
      description:
        'Насколько быстро будут становиться неактуальными старые посты. Минимальное значение - 1',
      min: 1,
      isPending: isGravityPendig,
      defaultValue: config.alogrithmGravity,
      onChange: (val: number) => {
        setGravity({ gravity: val })
      }
    },
    {
      title: 'Falling star K',
      description:
        'При больших значениях постам необходимо больше популярности, чтобы стать звездой. Минимальное значение - 1.1',
      min: 1.1,
      isPending: isStarPending,
      defaultValue: config.fallingStarK,
      onChange: (val: number) => {
        setFallingStarK({ K: val })
      }
    },
    {
      title: 'Past star interval',
      description:
        'Количество часов, за которое рассчитывается популярность поста до падения. Должно быть больше, чем nowInterval',
      min: config.nowInterval,
      isPending: isIntervalPending,
      defaultValue: config.pastInterval,
      onChange: (val: number) => {
        setIntervals({ past: val })
      }
    },
    {
      title: 'Now star interval',
      description:
        'Количество часов, за которое расчитывается популярность поста после падения. Должно быть меньше, чем pastInterval',
      max: config.pastInterval,
      isPending: isIntervalPending,
      defaultValue: config.nowInterval,
      onChange: (val: number) => {
        setIntervals({ now: val })
      }
    }
  ]

  return (
    <div className={styles.config}>
      <ul className={styles.config__list}>
        {distConfig.map((c, i) => (
          <li
            key={`${c.title}-{${i}`}
            className={styles.config__item}
          >
            <header className={styles.config__header}>
              <h2>{c.title}</h2>
              {c.isPending && <Preloader />}
            </header>
            {c.description && (
              <p className={styles.config__description}>{c.description}</p>
            )}
            <input
              className={styles.config__input}
              type='number'
              defaultValue={c.defaultValue}
              onChange={(e) => {
                const number = Number(e.target.value)

                if (
                  !number ||
                  (c.min && number < c.min) ||
                  (c.max && number > c.max)
                ) {
                  return
                }

                c.onChange(number)
              }}
            />
          </li>
        ))}
      </ul>
      <Button
        color='solid'
        loading={isPixelPending}
        onClick={() => {
          spawnPixel()
        }}
      >
        заспавнить битый пиксель
      </Button>
    </div>
  )
}

export default Config
