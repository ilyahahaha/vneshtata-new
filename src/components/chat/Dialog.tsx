import clsx from 'clsx'
import { Formik } from 'formik'
import { HiArrowLeft, HiExclamationCircle, HiPaperAirplane } from 'react-icons/hi'
import type { FormikErrors } from 'formik'
import Link from 'next/link'
import Avatar from '@/components/user/Avatar'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import { trpc } from '@/common/trpc'
import { TRPCClientError } from '@trpc/client'

type DialogUser = {
  id: string
  firstName: string
  lastName: string
  picture: string | null
}

const Dialog: React.FC<{
  user: DialogUser
  dialer: DialogUser
  messages: {
    content: string
    sentAt: string
    sender: {
      id: string
      firstName: string
      lastName: string
      picture: string | null
    }
    receiver: {
      id: string
      firstName: string
      lastName: string
      picture: string | null
    }
  }[]
}> = ({ user, dialer, messages }) => {
  const [error, setError] = useState<boolean>()

  const useSendMessage = trpc.chat.sendMessage.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <>
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center space-x-4">
          <Link href="/chat" className="pr-4 text-gray-900">
            <HiArrowLeft />
          </Link>
          <Avatar picture={dialer.picture} size={10} />
          <Link href={`/user/${dialer.id}`} className="text-lg font-medium leading-6 text-gray-900">
            {dialer.firstName} {dialer.lastName}
          </Link>
        </div>
      </div>
      <div className="border-t px-4 pb-4 sm:px-6">
        <div className="pt-4">
          {messages.length !== 0 ? (
            <Fragment>
              {messages.map((message, messageIdx) => {
                if (message.sender.id !== user.id) {
                  return (
                    <div className="chat chat-start" key={messageIdx}>
                      <Avatar picture={message.sender.picture} size={10} classNames="chat-image" />
                      <div className="chat-bubble">{message.content}</div>
                      <div className="chat-footer opacity-50">
                        {/* {formatDistanceDay(message.sentAt)} */}
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div className="chat chat-end" key={messageIdx}>
                      <Avatar picture={message.sender.picture} size={10} classNames="chat-image" />
                      <div className="chat-bubble">{message.content}</div>
                      <div className="chat-footer opacity-50">
                        {/* {formatDistanceDay(message.sentAt)} */}
                      </div>
                    </div>
                  )
                }
              })}
            </Fragment>
          ) : (
            <h1 className="text-center">
              Напишите первое сообщение, чтобы начать диалог с пользователем
            </h1>
          )}
        </div>
      </div>
      <div className="border-t px-4 pb-4 sm:px-6">
        <Formik
          initialValues={{
            message: '',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await useSendMessage.mutateAsync({
                senderId: user.id,
                receiverId: dialer.id,
                content: values.message,
              })
            } catch (error) {
              if (error instanceof TRPCClientError) {
                setSubmitting(false)
                return toast.error(error.message)
              }
            }

            setSubmitting(false)
            userQueriesUtils.chat.getMessages.invalidate({ userId: dialer.id })
            userQueriesUtils.chat.getMessages.invalidate({ userId: user.id })
            userQueriesUtils.chat.getDialogs.invalidate()
            values.message = ''
          }}
          validateOnChange={true}
          validate={(values: { message: string }) => {
            const errors: FormikErrors<{
              message: string
            }> = {}

            if (!values.message) {
              errors.message = 'Обязательное поле'
            }

            Object.keys(errors).length === 0 ? setError(false) : setError(true)

            return errors
          }}
        >
          {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-control pt-4">
                <div className="input-group input-group-sm">
                  <div className="relative w-full">
                    <input
                      type="text"
                      required
                      id="message"
                      onChange={handleChange}
                      value={values.message}
                      placeholder="Написать сообщение..."
                      className={clsx(
                        errors.message
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                          : '',
                        'input input-sm borded-md rounded-r-none border-gray-300 w-full'
                      )}
                    />

                    {errors.message ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div
                          className="tooltip tooltip-top tooltip-error"
                          data-tip={errors.message}
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
          )}
        </Formik>
      </div>
    </>
  )
}

export default Dialog
