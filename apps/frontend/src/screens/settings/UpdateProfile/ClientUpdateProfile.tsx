'use client'

import Input from '@/shared/ui/Input'
import Button from '@/shared/ui/Button'
import { useUpdateProfile, type UpdateProfileProps } from './useUpdateProfile'
import styles from './UpdateProfile.module.scss'

const ClientUpdateProfile = (props: UpdateProfileProps) => {
  const {
    data,
    register,
    errors,
    handleSubmit,
    onSubmit,
    avatar,
    setAvatar,
    wasAvatarChanged,
    isAvatarPending,
    isUserPending,
    isButtonDisabled
  } = useUpdateProfile(props)

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(onSubmit)(e)
      }}
      className={styles.profile}
    >
      <Input.Avatar
        value={avatar}
        setValue={setAvatar}
        initialSrc={data.avatar}
        onChange={() => {
          wasAvatarChanged.current = true
        }}
      />
      <div className={styles.profile__body}>
        <Input.Text
          placeholder='имя'
          error={errors.name?.message}
          {...register('name')}
        />
        <Input.Textarea
          placeholder='описание'
          error={errors.description?.message}
          {...register('description')}
        />
      </div>
      <Button
        className='align-start'
        color='solid'
        type='submit'
        loading={isAvatarPending || isUserPending}
        animate
        disabled={isButtonDisabled}
      >
        сохранить профиль
      </Button>
    </form>
  )
}

export default ClientUpdateProfile
