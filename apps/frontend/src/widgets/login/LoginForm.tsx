'use client'

import Logo from '@/icons/Logo'
import styles from './LoginForm.module.scss'
import Button from '@/components/Button'
import FormLayout from '@/layouts/FormLayout'
import Input from '@/components/Input'
import DecorationBlock from '@/components/DecorationBlock'
import { useLoginForm } from './useLoginForm'

const LoginForm = () => {
  const {
    topRef,
    bgRef,
    handleSubmit,
    onSubmit,
    errors,
    register,
    isPending,
    email,
    password
  } = useLoginForm()

  return (
    <FormLayout>
      <div
        ref={bgRef}
        className={styles.login}
      >
        <div className={styles.login__logo}>
          <Logo />
        </div>
        <h1>Вход</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.login__form}
        >
          <div className={styles.login__body}>
            <Input.Text
              placeholder='email'
              preventSpaces
              error={errors.email?.message}
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
            type='submit'
            loading={isPending}
          >
            войти
          </Button>
        </form>
      </div>
      <div
        ref={topRef}
        className={styles.login__overlay}
      >
        <DecorationBlock
          deps={[email]}
          position='top-left'
        />
        <DecorationBlock
          deps={[password]}
          position='bottom-right'
        />
      </div>
    </FormLayout>
  )
}

export default LoginForm
