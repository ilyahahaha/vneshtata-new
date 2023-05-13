import type { User } from '@/common/session'
import Avatar from '@/components/user/Avatar'
import Link from 'next/link'
import { Fragment } from 'react'

const Info: React.FC<{
  user: {
    firstName: string
    lastName: string
    id: string
    picture: string | null
    profile: {
      status: string | null
      position: string | null
      company: string | null
      country: string
      education: string | null
      about: string | null
    }
  }
  session: User
}> = ({ user, session }) => {
  return (
    <div className="max-w-3xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
      <div className="flex flex-row items-center space-x-5 shri">
        <Avatar picture={user.picture} size={12} />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          {user.profile.status ? (
            <p className="text-sm font-medium text-gray-500">{user.profile.status}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        {user.id === session.id ? (
          <Link href="/user/settings" type="button" className="btn btn-primary btn-sm">
            Редактировать
          </Link>
        ) : (
          <></>
          // <Fragment>
          //   <Link href={`/chat/${user.id}`} className="btn btn-ghost btn-sm">
          //     Сообщение
          //   </Link>

          //   <button
          //     type="button"
          //     onClick={async () => {
          //       try {
          //         setFollowingProccess(true)

          //         const result = await mutate(
          //           'follow',
          //           defaultPostCallback('/api/user/follow', {
          //             followingUserId: user.id,
          //             followerUserId: session.id,
          //             unfollow: isUserFollowed,
          //           }),
          //           false
          //         )
          //         toast.info(result?.message)
          //         setUserFollowed(!isUserFollowed)

          //         router.refresh()
          //       } catch (error) {
          //         if (error instanceof Error) {
          //           toast.error(error.message)
          //         }
          //       }

          //       setFollowingProccess(false)
          //     }}
          //     className={clsx(!isUserFollowed ? 'btn-primary' : 'btn-ghost', 'btn btn-sm')}
          //     disabled={isFollowingProccess}
          //   >
          //     {!isUserFollowed ? 'Подписаться' : 'Отписаться'}
          //   </button>
          // </Fragment>
        )}
      </div>
    </div>
  )
}

export default Info
