'use client'

import clsx from 'clsx'
import { HiChatAlt, HiExclamationCircle } from 'react-icons/hi'
import { HiPaperAirplane } from 'react-icons/hi2'
import { useState } from 'react'
import { Formik, FormikErrors } from 'formik'
import { toast } from 'react-toastify'
import Avatar from '@/components/user/Avatar'
import { trpc } from '@/common/trpc'
import { formatDistanceDay } from '@/common/utils/time'

const Comments: React.FC<{
  userId: string
  postId: string
  comments: {
    author: {
      firstName: string
      lastName: string
      picture: string | null
      id: string
    }
    content: string
    createdAt: string
  }[]
}> = ({ postId, comments }) => {
  const [error, setError] = useState<boolean>()

  const commentMutation = trpc.post.comment.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <div className="border-t border-gray-200">
      <div className="flow-root pt-4">
        <ul role="list" className="-mb-8">
          {comments.map((comment, commentIdx) => {
            return (
              <li key={commentIdx}>
                <div className="relative pb-8">
                  {commentIdx !== comments.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <Avatar picture={comment.author.picture} size={10} />

                      <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                        <HiChatAlt className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a
                            href={`/user/${comment.author.id}`}
                            className="font-medium text-gray-900"
                          >
                            {comment.author.firstName} {comment.author.lastName}
                          </a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {formatDistanceDay(new Date(comment.createdAt))}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <Formik
        initialValues={{ commentContent: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await commentMutation.mutateAsync({ content: values.commentContent, postId: postId })
          } catch (error) {
            if (error instanceof Error) {
              setSubmitting(false)
              return toast.error(error.message)
            }
          }

          values.commentContent = ''
          setSubmitting(false)
          userQueriesUtils.post.getPostComments.invalidate({ postId })
        }}
        validateOnChange={true}
        validate={(values: { commentContent: string }) => {
          const errors: FormikErrors<{
            commentContent: string
          }> = {}

          if (!values.commentContent) {
            errors.commentContent = 'Обязательное поле'
          }

          Object.keys(errors).length === 0 ? setError(false) : setError(true)

          return errors
        }}
      >
        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
          <div className={clsx(comments.length !== 0 ? 'pt-4' : '')}>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <div className="input-group input-group-sm">
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="commentContent"
                      required
                      value={values.commentContent}
                      onChange={handleChange}
                      placeholder="Прокомментировать..."
                      className={clsx(
                        errors.commentContent
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                          : '',
                        'input input-bordered input-sm w-full'
                      )}
                    />
                    {errors.commentContent ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div
                          className="tooltip tooltip-top tooltip-error"
                          data-tip={errors.commentContent}
                        >
                          <HiExclamationCircle
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className={clsx(
                      isSubmitting ? 'loading' : '',
                      'btn btn-primary btn-sm btn-square'
                    )}
                    disabled={isSubmitting || error}
                  >
                    {!isSubmitting ? <HiPaperAirplane className="w-4 h-4" /> : ''}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default Comments
