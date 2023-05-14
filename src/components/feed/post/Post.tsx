import Avatar from '@/components/user/Avatar'
import Link from 'next/link'
import Actions from '@/components/feed/post/Actions'
import Comments from '@/components/feed/post/Comments'
import { PostType } from '../InfiniteFeed'
import { trpc } from '@/common/trpc'

const PostComponent: React.FC<{
  userId: string
  post: PostType
}> = ({ userId, post }) => {
  const { data: commentsQuery, isLoading } = trpc.post.getPostComments.useQuery({ postId: post.id })

  if (!commentsQuery || isLoading) {
    return <h1>Загрузка</h1>
  }

  const comments = commentsQuery.result.comments

  return (
    <div className="border rounded-md border-gray-200 px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <div className="flex flex-row items-center">
            <div className="items-center w-10 h-10">
              <Avatar picture={post.author.picture} size={10} />
            </div>

            <div className="ml-4">
              <Link href={`/user/${post.authorId}`}>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {post.author.firstName} {post.author.lastName}
                </h3>
              </Link>
              {/* <p className="text-sm text-gray-500">{formatDistanceDay(post.createdAt)}</p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <p>{post.content}</p>
      </div>

      <Actions
        postId={post.id}
        isLiked={post.likes.some((obj) => obj.likedBy.id === userId)}
        totalLikes={post.likes.length}
      />

      <Comments userId={userId} postId={post.id} comments={comments} />
    </div>
  )
}

export default PostComponent
