'use client'

import Logo from '@/shared/icons/Logo'
import Input from '@/shared/ui/Input'
import Button from '@/shared/ui/Button'
import { PAGES } from '@/constants'
import DecorationBlock from '@/shared/ui/DecorationBlock'
import cx from 'clsx'
import { useRegistration } from './useRegistration'
import styles from './Registration.module.scss'

const Registration = () => {
  const {
    bgRef,
    topRef,
    formRef,
    handleSubmit,
    onSubmit,
    errors,
    register,
    next,
    back,
    isChecking,
    isPending,
    email,
    password,
    description,
    name,
    avatarFile,
    setAvatarFile
  } = useRegistration()

  return (
    <>
      <div
        className={styles.registration}
        ref={bgRef}
      >
        <form
          ref={formRef}
          className={cx(styles.registration__form, 'container-form')}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.registration__screen}>
            <div className={styles.registration__logo}>
              <Logo />
            </div>
            <h1 className='align-center'>Регистрация</h1>
            <div className={styles.registration__body}>
              <Input.Text
                placeholder='email'
                error={errors.email?.message}
                inputMode='email'
                {...register('email')}
              />
              <Input.Password
                placeholder='пароль'
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
            <Button
              color='solid'
              onClick={next}
              loading={isChecking}
            >
              продолжить -{'>'}
            </Button>
            <Button
              className='align-center'
              color='underline'
              navigate={PAGES.LOGIN}
            >
              вход
            </Button>
          </div>
          <div className={styles.registration__screen}>
            <Button
              className='align-center'
              color='underline'
              onClick={back}
            >
              {'<'}- назад
            </Button>
            <h1 className='align-center'>Заполните профиль</h1>
            <div className={styles.registration__body}>
              <Input.Avatar
                className={cx('align-center', styles.registration__avatar)}
                value={avatarFile}
                setValue={setAvatarFile}
              />
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
              color='solid'
              type='submit'
              loading={isPending}
            >
              завершить регистрацию
            </Button>
          </div>
        </form>
      </div>
      <div
        ref={topRef}
        className={styles.registration__overlay}
      >
        <DecorationBlock
          deps={[email, name]}
          position='top-right'
        />
        <DecorationBlock
          deps={[password, description]}
          position='bottom-left'
        />
      </div>
    </>
  )
}

export default Registration
