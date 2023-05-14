import type { User } from '@/common/session'
import { trpc } from '@/common/trpc'
import type { Companies } from '@prisma/client'
import clsx from 'clsx'
import { Formik } from 'formik'
import type { FormikErrors } from 'formik'
import { useState } from 'react'
import { HiExclamationCircle, HiPlus } from 'react-icons/hi'
import { toast } from 'react-toastify'
import Map from '@/components/user/employements/Map'
import { TRPCClientError } from '@trpc/client'

const EmploymentForm: React.FC<{
  session: User
  employements: {
    position: string
    company: Companies
    employedOn: string
  }[]
}> = ({ session, employements }) => {
  const [employmentError, setEmploymentError] = useState<boolean>()

  const useCreateEmployements = trpc.user.createEmployement.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <div className="border z-10 rounded-md border-gray-200 sm:overflow-hidden">
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Опыт работы</h3>
          <p className="mt-1 text-sm text-gray-500">
            Расскажите другим пользователям о вашем опыте работе.
          </p>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            employeeCompany: 'AlfaBank',
            employeePosition: '',
            employedOn: new Date(),
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await useCreateEmployements.mutateAsync({
                company: values.employeeCompany,
                position: values.employeePosition,
                employedOn: values.employedOn.toISOString(),
              })

              toast.info(result?.message)
            } catch (error) {
              if (error instanceof TRPCClientError) {
                setSubmitting(false)
                return toast.error(error.message)
              }
            }

            setSubmitting(false)

            userQueriesUtils.user.getUser.invalidate({ userId: session.id })
          }}
          validateOnChange={true}
          validate={(values) => {
            const errors: FormikErrors<{
              employeePosition: string
              employedOn: string
            }> = {}

            if (!values.employeePosition) {
              errors.employeePosition = 'Обязательное поле'
            }

            if (!values.employedOn) {
              errors.employedOn = 'Обязательное поле'
            }

            Object.keys(errors).length === 0 ? setEmploymentError(false) : setEmploymentError(true)

            return errors
          }}
        >
          {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
            <form id="employee" onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 relative">
                  <label
                    htmlFor="employeeCompany"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Место работы
                  </label>
                  <select
                    id="employeeCompany"
                    onChange={handleChange}
                    value={values.employeeCompany}
                    autoComplete="employeeCompany"
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900"
                  >
                    <option value="AlfaBank">Альфа-Банк</option>
                    <option value="MTS">МТС</option>
                    <option value="Rostelecom">Ростелеком</option>
                    <option value="Sber">Сбербанк</option>
                    <option value="Tinkoff">Тинькофф</option>
                    <option value="VK">ВКонтакте</option>
                    <option value="Yandex">Яндекс</option>
                  </select>
                </div>
                <div className="col-span-1 relative">
                  <label
                    htmlFor="employeePosition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Должность
                  </label>
                  <input
                    type="text"
                    id="employeePosition"
                    autoComplete="employeePosition"
                    onChange={handleChange}
                    value={values.employeePosition}
                    required
                    className={clsx(
                      errors.employeePosition
                        ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                        : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                      'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                    )}
                  />
                  {errors.employeePosition ? (
                    <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                      <div
                        className="tooltip tooltip-left tooltip-error"
                        data-tip={errors.employeePosition}
                      >
                        <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  ) : null}
                </div>
                {/* <div className="col-span-1 relative">
                  <label htmlFor="employedOn" className="block text-sm font-medium text-gray-700">
                    Дата
                  </label>

                  <DatePickerField
                    name="employedOn"
                    id="employedOn"
                    autoComplete="employedOn"
                    required
                    className={clsx(
                      errors.employedOn
                        ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                        : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                      'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                    )}
                  />
                  {errors.employedOn ? (
                    <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                      <div
                        className="tooltip tooltip-left tooltip-error"
                        data-tip={errors.employedOn}
                      >
                        <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  ) : null}
                </div> */}
              </div>
              <div className="relative pt-4">
                <button
                  type="submit"
                  className={clsx(
                    isSubmitting ? 'loading' : '',
                    'btn btn-primary btn-sm w-full flex justify-center py-2 px-4'
                  )}
                  disabled={isSubmitting || employmentError}
                >
                  {!isSubmitting ? <HiPlus className="w-4 h-4" /> : ''}
                </button>
              </div>
            </form>
          )}
        </Formik>

        <div className="relative">
          <Map employements={employements} />
        </div>
      </div>
    </div>
  )
}

export default EmploymentForm
