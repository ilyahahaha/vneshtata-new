import { trpc } from '@/common/trpc'
import Loading from '@/components/Loading'
import EmploymentForm from '@/components/user/settings/EmployementForm'
import ProfileForm from '@/components/user/settings/ProfileForm'
import Sidebar from '@/components/user/settings/Sidebar'
import UserForm from '@/components/user/settings/UserForm'
import useSession from '@/hooks/useSession'
import type { NextPage } from 'next'

const UserSettings: NextPage = () => {
  const { session, isLoading } = useSession()

  if (!session) {
    return <h1>Ошибка</h1>
  }

  const { data: userData } = trpc.user.getUser.useQuery({
    userId: session.id,
  })

  const { data: busiedUserIdsData } = trpc.user.getBusiedIds.useQuery()

  if (isLoading) {
    return <Loading />
  }

  const profile = userData?.result.user.profile
  const previousEmployments = userData?.result.user.previousEmployments
  const busiedUserIds = busiedUserIdsData?.result.ids

  if (!profile || !previousEmployments || !busiedUserIds) {
    return <Loading />
  }

  return (
    <>
      <div className="block pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Настройки профиля</h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <Sidebar />

        <div className="space-y-6 lg:col-span-9">
          <UserForm session={session} busiedUserIds={busiedUserIds} />
          <ProfileForm session={session} profile={profile} />
          <EmploymentForm session={session} employements={previousEmployments} />
        </div>
      </div>
    </>
  )
}

export default UserSettings
