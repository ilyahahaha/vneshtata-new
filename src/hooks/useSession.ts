import { useEffect } from 'react'
import Router from 'next/router'
import { trpc } from '@/common/trpc'

const useSession = ({ redirectTo = '', redirectIfFound = false } = {}) => {
  const { data: session, isLoading, isError } = trpc.user.session.useQuery()

  useEffect(() => {
    if (!redirectTo || !session) return

    if (
      (redirectTo && !redirectIfFound && !session?.isLoggedIn) ||
      (redirectIfFound && session?.isLoggedIn)
    ) {
      Router.push(redirectTo)
    }

    if (isError) Router.push('/404')
  }, [isError, redirectIfFound, redirectTo, session])

  return { session, isLoading }
}

export default useSession
