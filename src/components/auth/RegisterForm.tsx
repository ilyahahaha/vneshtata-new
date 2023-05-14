import type { FormikErrors } from 'formik'

import { trpc } from '@/common/trpc'
import clsx from 'clsx'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import { HiExclamationCircle } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { TRPCClientError } from '@trpc/client'

const RegisterForm: React.FC = () => {
  const [error, setError] = useState<boolean>()
  const router = useRouter()

  const useRegister = trpc.user.register.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const result = await useRegister.mutateAsync({ ...values })

          userQueriesUtils.user.session.invalidate()

          toast.info(result?.message)
        } catch (error) {
          if (error instanceof TRPCClientError) {
            setSubmitting(false)
            return toast.error(error.message)
          }
        }

        setSubmitting(false)

        router.push('/feed')
      }}
      validateOnChange={true}
      validate={(values: {
        firstName: string
        lastName: string
        email: string
        password: string
      }) => {
        const errors: FormikErrors<{
          firstName: string
          lastName: string
          email: string
          password: string
        }> = {}

        if (!values.firstName) {
          errors.firstName = 'Обязательное поле'
        } else if (!/^[ЁёА-я]/i.test(values.firstName)) {
          errors.firstName = 'Разрешены только русские символы'
        }

        if (!values.lastName) {
          errors.lastName = 'Обязательное поле'
        } else if (!/^[ЁёА-я]/i.test(values.lastName)) {
          errors.lastName = 'Разрешены только русские символы'
        }

        if (!values.email) {
          errors.email = 'Обязательное поле'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          errors.email = 'Неверный адрес электронной почты'
        }

        if (!values.password) {
          errors.password = 'Обязательное поле'
        }

        Object.keys(errors).length === 0 ? setError(false) : setError(true)

        return errors
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <div className="flex -space-x-px">
                <div className="w-1/2 flex-1 min-w-0">
                  <label htmlFor="firstName" className="sr-only">
                    Имя
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      required
                      className={clsx(
                        errors.firstName
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                          : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                        'appearance-none rounded-none rounded-tl-md relative block w-full px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm'
                      )}
                      placeholder="Имя"
                      onChange={handleChange}
                      value={values.firstName}
                    />
                    {errors.firstName ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div
                          className="tooltip tooltip-top tooltip-error"
                          data-tip={errors.firstName}
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
                <div className="w-1/2 flex-2 min-w-0">
                  <label htmlFor="lastName" className="sr-only">
                    Фамилия
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      required
                      className={clsx(
                        errors.lastName
                          ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                          : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                        'appearance-none rounded-none rounded-tr-md relative block w-full px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm'
                      )}
                      placeholder="Фамилия"
                      onChange={handleChange}
                      value={values.lastName}
                    />
                    {errors.lastName ? (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div
                          className="tooltip tooltip-top tooltip-error"
                          data-tip={errors.lastName}
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
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={clsx(
                    errors.email
                      ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                      : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                    'appearance-none rounded-none relative block w-full px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm'
                  )}
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.email}
                />
                {errors.email ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="tooltip tooltip-right tooltip-error" data-tip={errors.email}>
                      <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={clsx(
                    errors.password
                      ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                      : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                    'appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm'
                  )}
                  placeholder="Пароль"
                  onChange={handleChange}
                  value={values.password}
                />
                {errors.password ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="tooltip tooltip-right tooltip-error" data-tip={errors.password}>
                      <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agreement"
              name="agreement"
              type="checkbox"
              className="h-4 w-4 border-gray-300 rounded"
              checked
              disabled
            />
            <label htmlFor="agreement" className="ml-2 block text-sm text-gray-900">
              Я принимаю условия Пользовательского соглашения.
            </label>
          </div>

          <div>
            <button
              type="submit"
              className={clsx(
                isSubmitting ? 'loading' : '',
                'btn btn-primary btn-sm w-full flex justify-center py-2 px-4'
              )}
              disabled={isSubmitting || error}
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      )}
    </Formik>
  )
}

export default RegisterForm
