import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULTS, PAGES } from './constants'
import { COOKIES } from '@repo/constants'
import { getPayload } from './shared/functions/getPayload'

export const proxy = async (req: NextRequest) => {
  const token = req.cookies.get(COOKIES.TOKEN)?.value
  const pathname = req.nextUrl.pathname

  const payload = await getPayload(token)
  const role = payload?.role

  if (pathname.startsWith('/_next') || pathname.startsWith('/uploads')) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL(DEFAULTS.START_PAGE, req.url))
  }

  if (
    (!token || !payload) &&
    !(
      pathname.startsWith(PAGES.REGISTRATION) ||
      pathname.startsWith(PAGES.LOGIN) ||
      pathname.startsWith(PAGES.USER('')) ||
      pathname.startsWith(PAGES.PLANE)
    )
  ) {
    return NextResponse.redirect(new URL(DEFAULTS.START_PAGE, req.url))
  }

  if (
    token &&
    (pathname.startsWith(PAGES.LOGIN) ||
      pathname.startsWith(PAGES.REGISTRATION))
  ) {
    return NextResponse.redirect(new URL(PAGES.PROFILE, req.url))
  }

  if (
    (role === 'MODERATOR' || role === 'ADMIN') &&
    pathname.startsWith(PAGES.PROFILE)
  ) {
    return NextResponse.redirect(new URL(PAGES.MODERATOR, req.url))
  }

  if ((role === 'USER' || !role) && pathname.startsWith(PAGES.MODERATOR)) {
    return NextResponse.redirect(new URL(PAGES.PROFILE, req.url))
  }
}
