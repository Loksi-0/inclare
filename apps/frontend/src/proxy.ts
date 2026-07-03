import { NextResponse, type NextRequest } from 'next/server'
import { PAGES } from './constants'
import { COOKIES } from '@repo/constants'

export const proxy = async (req: NextRequest) => {
  const token = req.cookies.get(COOKIES.TOKEN)?.value
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL(PAGES.LOGIN, req.url))
  }

  if (
    !token &&
    !(
      pathname.startsWith(PAGES.REGISTRATION) ||
      pathname.startsWith(PAGES.LOGIN)
    )
  ) {
    return NextResponse.redirect(new URL(PAGES.LOGIN, req.url))
  }

  if (
    token &&
    (pathname.startsWith(PAGES.LOGIN) ||
      pathname.startsWith(PAGES.REGISTRATION))
  ) {
    return NextResponse.redirect(new URL(PAGES.PROFILE, req.url))
  }
}
