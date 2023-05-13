import Link from 'next/link'
import { Fragment } from 'react'
import Avatar from '@/components/user/Avatar'

const Followers: React.FC<{
  followers: {
    follower: {
      firstName: string
      id: string
      picture: string | null
    }
  }[]
}> = ({ followers }) => {
  return (
    <section aria-labelledby="friends-title" className="lg:col-start-3 lg:col-span-1 pb-5">
      <div className="bg-white border rounded-md border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <p className="text-sm text-gray-500">
            <a href="#" className="text-lg font-medium leading-6 text-gray-900 cursor-default">
              Подписчики
            </a>
            {' · '}
            {followers.length}
          </p>
        </div>
        <div className="border-t px-4 pb-4 sm:px-6">
          {followers.length !== 0 ? (
            <Fragment>
              <div className="mt-4 grid grid-cols-5 gap-4">
                {followers.slice(0, 5).map((follower, followerIdx) => (
                  <Link
                    key={followerIdx}
                    href={`/user/${follower.follower.id}`}
                    className="text-center flex flex-col items-center"
                  >
                    <div className="items-center w-12 h-12">
                      <Avatar picture={follower.follower.picture} size={12} />
                    </div>
                    <div className="text-center">
                      <h1 className="pt-2 text-xs text-gray-900">{follower.follower.firstName}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            </Fragment>
          ) : (
            <h3 className="pt-4 text-sm text-gray-500">Список пуст</h3>
          )}
        </div>
      </div>
    </section>
  )
}

export default Followers
