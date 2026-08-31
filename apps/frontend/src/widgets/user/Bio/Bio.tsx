'use client'

import Image from '@/components/Image'
import cx from 'clsx'
import styles from './Bio.module.scss'
import Button from '@/components/Button'
import { shareProfile } from '@/shared/functions/shareProfile'
import Avatar from '@/components/Avatar'

type BioProps = {
  id: string
  avatar: string | null
  name: string
  description: string | null
}

const Bio = (props: BioProps) => {
  const { id, avatar, name, description } = props

  return (
    <div className={styles.bio}>
      <Avatar
        className={styles.bio__avatar}
        src={avatar}
        width={200}
        height={200}
        expandable
      />
      <div className={styles.bio__body}>
        <Button
          color='underline'
          className='h1'
          onClick={() => {
            shareProfile(id)
          }}
        >
          {name}
        </Button>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}

export default Bio
