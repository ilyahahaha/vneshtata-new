import type { IronSessionOptions } from 'iron-session'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  picture: string | null
  isLoggedIn: boolean
}

export const EmptySession: User = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  picture: null,
  isLoggedIn: false,
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}
