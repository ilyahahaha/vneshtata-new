import type { User } from '@/common/session'
import { trpc } from '@/common/trpc'
import Followers from '@/components/user/Followers'
import Info from '@/components/user/Info'
import Profile from '@/components/user/Profile'
import List from '@/components/user/employements/List'
import useSession from '@/hooks/useSession'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const UserProfile: NextPage = () => {
  const router = useRouter()

  const { session, isLoading: isSessionLoading } = useSession()

  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
  } = trpc.user.getUser.useQuery({ userId: router.query.userId as string })

  if (isUserLoading || isSessionLoading) {
    return <h1>Загрузка</h1>
  }

  if (!userData || isError) {
    return <h1>Ошибка</h1>
  }

  const user = userData.result.user

  return (
    <>
      <Info user={user} session={session as User} />

      <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          <Profile profile={user.profile} />
        </div>

        <div>
          <Followers followers={user.followedBy} />

          <List employements={user.previousEmployments} />
        </div>
      </div>
    </>
  )
}

export default UserProfile
