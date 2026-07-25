'use client'

import Logo from '@/icons/Logo'
import styles from './Header.module.scss'
import Button from '../Button'
import { PAGES } from '@/constants'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <Logo />
      </div>
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
