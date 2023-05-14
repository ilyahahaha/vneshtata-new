import { trpc } from '@/common/trpc'
import clsx from 'clsx'
import { useState } from 'react'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2'
import { toast } from 'react-toastify'

const Actions: React.FC<{
  postId: string
  isLiked: boolean
  totalLikes: number
}> = ({ postId, isLiked, totalLikes }) => {
  const [isPostLiked, setPostLike] = useState<boolean>(isLiked)
  const [isLikingProccess, setLikingProccess] = useState<boolean>(false)

  const [postLikes, setPostLikes] = useState<number>(totalLikes)

  const useLikePost = trpc.post.like.useMutation()

  return (
    <div className="pt-4 pb-4">
      <button
        onClick={async () => {
          try {
            setLikingProccess(true)

            await useLikePost.mutateAsync({ postId: postId, dislike: isPostLiked })

            setPostLike(!isPostLiked)
            setPostLikes(!isPostLiked ? postLikes + 1 : postLikes - 1)
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message)
            }
          }

          setLikingProccess(false)
        }}
        className={clsx(
          isPostLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500',
          'flex items-center'
        )}
        disabled={isLikingProccess}
      >
        {isPostLiked ? <HiHeart className="w-6 h-6" /> : <HiOutlineHeart className="w-6 h-6" />}

        <p className="pl-1">{postLikes}</p>
      </button>
    </div>
  )
}

export default Actions
