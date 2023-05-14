import type { User } from '@/common/session'
import InfiniteFeed from '@/components/feed/InfiniteFeed'
import PostForm from '@/components/feed/PostForm'
import useSession from '@/hooks/useSession'
import type { NextPage } from 'next'

const Feed: NextPage = () => {
  const { session, isLoading: isSessionLoading } = useSession()

  if (isSessionLoading) {
    return <h1>Загрузка</h1>
  }

  return (
    <>
      <div className="block pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Лента новостей</h1>
      </div>

      <PostForm user={session as User} />

      <div className="pt-4">
        <InfiniteFeed user={session as User} />
      </div>
    </>
  )
}

export default Feed
