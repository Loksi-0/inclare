'use client'

import Logo from '@/icons/Logo'
import Button from '../Button'
import { PAGES } from '@/constants'
import { usePathname } from 'next/navigation'
import styles from './Header.module.scss'

const Header = () => {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <Button
        className={styles.header__logo}
        color='none'
        navigate={PAGES.PROFILE}
      >
        <Logo />
      </Button>
      <nav className={styles.header__nav}>
        <Button
          navigate={PAGES.PROFILE}
          color={pathname === PAGES.PROFILE ? 'underline' : 'underline-gray'}
        >
          профиль
        </Button>
        <div className={styles.header__splitter}></div>
        <Button
          navigate={PAGES.PLANE}
          color={pathname === PAGES.PLANE ? 'underline' : 'underline-gray'}
        >
          плоскость
        </Button>
      </nav>
    </header>
  )
}

export default Header
