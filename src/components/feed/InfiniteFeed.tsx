import type { User } from '@/common/session'
import { trpc } from '@/common/trpc'
import PostComponent from './post/Post'
import Loading from '../Loading'

export type PostType = {
  id: string
  authorId: string
  content: string
  createdAt: string
  author: {
    firstName: string
    lastName: string
    picture: string | null
  }
  likes: {
    likedBy: {
      id: string
      firstName: string
      lastName: string
      picture: string | null
    }
  }[]
}

const InfiniteFeed: React.FC<{ user: User }> = ({ user }) => {
  const { data: postsQuery, isLoading } = trpc.post.getPosts.useQuery({ skip: 0 })
  const postsData = postsQuery?.result.posts

  if (isLoading || !postsData) {
    return <Loading />
  }

  if (postsData.length == 0) {
    return (
      <div className="border rounded-md border-gray-200 px-4 py-5 sm:px-6">
        <h1 className="text-center">
          Подпишитесь на пользователей, чтобы увидеть обновления вашей ленты.
        </h1>
      </div>
    )
  }

  return (
    <ul role="list">
      {postsData.map((item) => (
        <li key={item.id} className="py-4">
          <PostComponent userId={user.id} post={item} />
        </li>
      ))}
    </ul>
  )
}

export default InfiniteFeed
