import Avatar from '@/components/user/Avatar'
import clsx from 'clsx'
import { useState } from 'react'
import { Formik, FormikErrors } from 'formik'
import { HiExclamationCircle } from 'react-icons/hi'
import { toast } from 'react-toastify'
import type { User } from '@/common/session'
import { trpc } from '@/common/trpc'

const PostForm: React.FC<{ user: User }> = ({ user }) => {
  const [error, setError] = useState<boolean>()

  const useAddPost = trpc.post.addPost.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <div className="border rounded-md border-gray-200 px-4 py-5 sm:px-6">
      <div className="flex items-start space-x-4 w-full py-2">
        <div className="flex-shrink-0">
          <Avatar picture={user.picture} size={10} />
        </div>
        <div className="min-w-0 flex-1">
          <Formik
            initialValues={{
              content: '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const post = await useAddPost.mutateAsync({ ...values })

                toast.info(post?.message)
              } catch (error) {
                if (error instanceof Error) {
                  setSubmitting(false)
                  return toast.error(error.message)
                }
              }

              values.content = ''
              setSubmitting(false)
              userQueriesUtils.post.getPosts.invalidate()
            }}
            validateOnChange={true}
            validate={(values: { content: string }) => {
              const errors: FormikErrors<{
                content: string
              }> = {}

              if (!values.content) {
                errors.content = 'Обязательное поле'
              }

              Object.keys(errors).length === 0 ? setError(false) : setError(true)

              return errors
            }}
          >
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div className="border-b border-gray-200 focus-within:border-primary">
                  <div className="relative">
                    <textarea
                      rows={3}
                      required
                      id="content"
                      onChange={handleChange}
                      value={values.content}
                      className={clsx(
                        errors.content
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                          : '',
                        'block w-full border-0 border-b border-transparent p-0 pb-2 resize-none focus:ring-0 focus:border-primary sm:text-sm'
                      )}
                      placeholder="Что у вас нового?"
                    />
                    {errors.content ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div
                          className="tooltip tooltip-top tooltip-error"
                          data-tip={errors.content}
                        >
                          <HiExclamationCircle
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="pt-4 flex justify-between float-right">
                    <button
                      type="submit"
                      className={clsx(isSubmitting ? 'loading' : '', 'btn btn-primary btn-sm')}
                      disabled={isSubmitting || error}
                    >
                      Опубликовать
                    </button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default PostForm
