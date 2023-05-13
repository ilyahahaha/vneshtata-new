import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { sessionOptions } from '@/common/session'

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, sessionOptions)

  const { user } = session

  switch (req.nextUrl.pathname) {
    case '/':
    case '/auth':
    case '/auth/register':
      if (user && user.isLoggedIn) {
        return NextResponse.redirect(new URL('/feed', req.url))
      }

      return res

    case '/user':
      if (user && user.isLoggedIn) {
        return NextResponse.redirect(new URL(`/user/${user.id}`, req.url))
      }

      return NextResponse.redirect(new URL('/auth', req.url))

    default:
      if (user && user.isLoggedIn) {
        return res
      }

      return NextResponse.redirect(new URL('/auth', req.url))
  }
}

export const config = {
  matcher: ['/', '/feed', '/auth/:path*', '/user/:path*', '/chat/:path'],
}
