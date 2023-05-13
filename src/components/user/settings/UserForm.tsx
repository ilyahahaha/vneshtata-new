import type { User } from '@/common/session'
import { Formik } from 'formik'
import type { FormikErrors } from 'formik'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Avatar from '@/components/user/Avatar'
import clsx from 'clsx'
import { HiExclamationCircle } from 'react-icons/hi'
import { trpc } from '@/common/trpc'

const UserForm: React.FC<{ session: User; busiedUserIds: { id: string }[] }> = ({
  session,
  busiedUserIds,
}) => {
  const [acccountError, setAccountError] = useState<boolean>()

  const useUserUpdate = trpc.user.updateUser.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <Formik
      enableReinitialize
      initialValues={{
        newUserId: session.id,
        firstName: session.firstName,
        lastName: session.lastName,
        email: session.email,
        password: '',
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const result = await useUserUpdate.mutateAsync({ userId: session.id, ...values })

          toast.info(result?.message)
        } catch (error) {
          if (error instanceof Error) {
            setSubmitting(false)
            return toast.error(error.message)
          }
        }

        setSubmitting(false)
        userQueriesUtils.user.session.invalidate()
      }}
      validateOnChange={true}
      validate={(values) => {
        const errors: FormikErrors<{
          newUserId: string
          firstName: string
          lastName: string
          email: string
        }> = {}

        if (
          values.newUserId &&
          values.newUserId !== session?.id &&
          busiedUserIds.find((obj) => obj.id === values.newUserId)
        ) {
          errors.newUserId = 'ID должен быть уникальным'
        }

        if (values.newUserId === 'settings' || values.newUserId === 'Settings') {
          errors.newUserId = 'Недопустимый ID'
        }

        if (values.firstName && !/^[ЁёА-я]/i.test(values.firstName)) {
          errors.firstName = 'Разрешены только русские символы'
        }

        if (values.lastName && !/^[ЁёА-я]/i.test(values.lastName)) {
          errors.lastName = 'Разрешены только русские символы'
        }

        if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          errors.email = 'Неверный адрес электронной почты'
        }

        Object.keys(errors).length === 0 ? setAccountError(false) : setAccountError(true)

        return errors
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <form id="account" onSubmit={handleSubmit}>
          <div className="border rounded-md border-gray-200 sm:overflow-hidden">
            <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Аккаунт</h3>
                <p className="mt-1 text-sm text-gray-500">Основная информация о вас.</p>
              </div>

              {/* Фото и ID */}
              <div className="grid grid-cols-3 gap-6">
                {/* <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Аватар</label>
                  <div className="mt-1 flex items-center">
                    <Avatar picture={session.picture} size={12} />

                    <button
                      type="button"
                      onClick={async () => {
                        openFileSelector()
                      }}
                      className={clsx(
                        imageLoading ? 'loading' : '',
                        'btn btn-sm btn-outlined ml-5 py-2 px-3'
                      )}
                    >
                      Изменить
                    </button>
                    {session.picture ? (
                      <button
                        type="button"
                        onClick={async () => {
                          setImageDeleting(true)

                          try {
                            const result = await mutate(
                              'deleteImage',
                              defaultPostCallback('/api/user/deleteImage', {
                                id: session.id,
                              }),
                              false
                            )

                            toast.info(result?.message)
                          } catch (error) {
                            if (error instanceof Error) {
                              return toast.error(error.message)
                            }
                          }

                          setImageDeleting(false)
                          router.refresh()
                        }}
                        className={clsx(
                          imageDeleting ? 'loading' : '',
                          'btn btn-sm btn-outlined ml-2'
                        )}
                      >
                        Удалить
                      </button>
                    ) : null}
                  </div>
                </div> */}
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="newUserId" className="block text-sm font-medium text-gray-700">
                    ID пользователя
                  </label>
                  <div className="mt-1 rounded-md shadow-sm flex relative">
                    <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                      внештата.рф/user/
                    </span>
                    <input
                      type="text"
                      id="newUserId"
                      autoComplete="newUserId"
                      value={values.newUserId}
                      onChange={handleChange}
                      className={clsx(
                        errors.newUserId
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                          : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                        ' flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm'
                      )}
                    />
                    {errors.newUserId ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div
                          className="tooltip tooltip-left tooltip-error"
                          data-tip={errors.newUserId}
                        >
                          <HiExclamationCircle
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Имя и фамилия */}
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2 relative">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    autoComplete="given-name"
                    onChange={handleChange}
                    value={values.firstName}
                    className={clsx(
                      errors.firstName
                        ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                        : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                      'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                    )}
                  />
                  {errors.firstName ? (
                    <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                      <div
                        className="tooltip tooltip-left tooltip-error"
                        data-tip={errors.firstName}
                      >
                        <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="col-span-2 relative">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    autoComplete="lastName"
                    onChange={handleChange}
                    value={values.lastName}
                    className={clsx(
                      errors.lastName
                        ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                        : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                      'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                    )}
                  />
                  {errors.lastName ? (
                    <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                      <div
                        className="tooltip tooltip-left tooltip-error"
                        data-tip={errors.lastName}
                      >
                        <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={values.email}
                  className={clsx(
                    errors.email
                      ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                      : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                    'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                  )}
                />
                {errors.email ? (
                  <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                    <div className="tooltip tooltip-left tooltip-error" data-tip={errors.email}>
                      <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Пароль */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="password"
                  placeholder="************"
                  onChange={handleChange}
                  value={values.password}
                  className={clsx(
                    errors.password
                      ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                      : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                    'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                  )}
                />
                {errors.password ? (
                  <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                    <div className="tooltip tooltip-left tooltip-error" data-tip={errors.password}>
                      <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6">
              <button
                type="submit"
                className={clsx(
                  isSubmitting ? 'loading' : '',
                  'btn btn-primary btn-sm w-full flex justify-center py-2 px-4'
                )}
                disabled={isSubmitting || acccountError}
              >
                Сохранить
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  )
}

export default UserForm
