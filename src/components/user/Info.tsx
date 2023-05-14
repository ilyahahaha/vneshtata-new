import type { User } from '@/common/session'
import { trpc } from '@/common/trpc'
import Avatar from '@/components/user/Avatar'
import { TRPCClientError } from '@trpc/client'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'

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
  isFollowed: boolean
}> = ({ user, session, isFollowed }) => {
  const [isUserFollowed, setUserFollowed] = useState<boolean>(isFollowed)
  const [isFollowingProccess, setFollowingProccess] = useState<boolean>(false)

  const useUserFollow = trpc.user.follow.useMutation()
  const userQueriesUtils = trpc.useContext()

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
          <Fragment>
            <Link href={`/chat/${user.id}`} className="btn btn-ghost btn-sm">
              Сообщение
            </Link>

            <button
              type="button"
              onClick={async () => {
                try {
                  setFollowingProccess(true)

                  const result = await useUserFollow.mutateAsync({
                    postId: user.id,
                    dislike: isUserFollowed,
                  })

                  toast.info(result?.message)
                  setUserFollowed(!isUserFollowed)
                } catch (error) {
                  if (error instanceof TRPCClientError) {
                    toast.error(error.message)
                  }
                }

                userQueriesUtils.user.getUser.invalidate({ userId: user.id })
                setFollowingProccess(false)
              }}
              className={clsx(!isUserFollowed ? 'btn-primary' : 'btn-ghost', 'btn btn-sm')}
              disabled={isFollowingProccess}
            >
              {!isUserFollowed ? 'Подписаться' : 'Отписаться'}
            </button>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Info
