import { Formik } from 'formik'
import { useState } from 'react'
import type { FormikErrors } from 'formik'
import { toast } from 'react-toastify'
import { trpc } from '@/common/trpc'
import clsx from 'clsx'
import { HiExclamationCircle } from 'react-icons/hi'
import type { User } from '@/common/session'
import { TRPCClientError } from '@trpc/client'

const ProfileForm: React.FC<{
  session: User
  profile: {
    status: string | null
    position: string | null
    company: string | null
    country: string
    education: string | null
    about: string | null
  }
}> = ({ session, profile }) => {
  const [profileError, setProfileError] = useState<boolean>()

  const useProfileUpdate = trpc.user.updateProfile.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <Formik
      enableReinitialize
      initialValues={{
        status: profile.status ?? '',
        position: profile.position ?? '',
        company: profile.company ?? '',
        country: profile.country,
        education: profile.education ?? '',
        about: profile.about ?? '',
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const result = await useProfileUpdate.mutateAsync({ ...values })

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
          status: string
          position: string
          company: string
          education: string
          about: string
        }> = {}

        if (values.about && values.about.length > 500) {
          errors.about = 'Описание не может быть более 500 символов'
        }

        if (values.status && values.status.length > 64) {
          errors.status = 'Статус не может быть более 64 символов'
        }

        if (values.position && values.position.length > 32) {
          errors.position = 'Должность не может быть более 32 символов'
        }

        if (values.company && values.company.length > 32) {
          errors.company = 'Место работы не может быть более 32 символов'
        }

        if (values.education && values.position.length > 64) {
          errors.education = 'Образование не может быть более 64 символов'
        }

        Object.keys(errors).length === 0 ? setProfileError(false) : setProfileError(true)

        return errors
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
        <form id="profile" onSubmit={handleSubmit}>
          <div className="border rounded-md border-gray-200 sm:overflow-hidden">
            <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Профиль</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Публичная информация, которая доступна всем пользователям.
                </p>
              </div>

              {/* О себе */}
              <div className="relative">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  О себе
                </label>
                <textarea
                  id="about"
                  autoComplete="about"
                  onChange={handleChange}
                  value={values.about}
                  className={clsx(
                    errors.about
                      ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                      : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                    'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                  )}
                />
                {errors.about ? (
                  <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                    <div className="tooltip tooltip-left tooltip-error" data-tip={errors.about}>
                      <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Статус */}
              <div className="relative">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Статус
                </label>
                <input
                  type="text"
                  id="status"
                  autoComplete="status"
                  onChange={handleChange}
                  value={values.status}
                  className={clsx(
                    errors.status
                      ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                      : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                    'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                  )}
                />
                {errors.status ? (
                  <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                    <div className="tooltip tooltip-left tooltip-error" data-tip={errors.status}>
                      <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Должность и место работы */}
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2 relative">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Должность
                  </label>
                  <input
                    type="text"
                    id="position"
                    autoComplete="position"
                    onChange={handleChange}
                    value={values.position}
                    className={clsx(
                      errors.position
                        ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                        : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                      'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                    )}
                  />
                  {errors.position ? (
                    <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                      <div
                        className="tooltip tooltip-left tooltip-error"
                        data-tip={errors.position}
                      >
                        <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="col-span-2 relative">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Место работы
                  </label>
                  <input
                    type="text"
                    id="company"
                    autoComplete="company"
                    onChange={handleChange}
                    value={values.company}
                    className={clsx(
                      errors.company
                        ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                        : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                      'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                    )}
                  />
                  {errors.company ? (
                    <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                      <div className="tooltip tooltip-left tooltip-error" data-tip={errors.company}>
                        <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Образование и страна */}
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2 relative">
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                    Образование
                  </label>
                  <input
                    type="text"
                    id="education"
                    autoComplete="education"
                    onChange={handleChange}
                    value={values.education}
                    className={clsx(
                      errors.education
                        ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500 placeholder-red-500'
                        : 'focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900',
                      'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm'
                    )}
                  />
                  {errors.education ? (
                    <div className="absolute inset-y-0 right-0 pt-6 pr-3 flex items-center">
                      <div
                        className="tooltip tooltip-left tooltip-error"
                        data-tip={errors.education}
                      >
                        <HiExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="col-span-2 relative">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Страна
                  </label>
                  <select
                    id="country"
                    onChange={handleChange}
                    value={values.country}
                    autoComplete="country"
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-primary focus:border-primary border-gray-300 placeholder-gray-500 text-gray-900"
                  >
                    <option>Не выбрано</option>
                    <option>Россия</option>
                    <option>Абхазия</option>
                    <option>Австралия</option>
                    <option>Австрия</option>
                    <option>Азербайджан</option>
                    <option>Албания</option>
                    <option>Алжир</option>
                    <option>Ангола</option>
                    <option>Ангуилья</option>
                    <option>Андорра</option>
                    <option>Антигуа и Барбуда</option>
                    <option>Антильские острова</option>
                    <option>Аргентина</option>
                    <option>Армения</option>
                    <option>Афганистан</option>
                    <option>Багамские острова</option>
                    <option>Бангладеш</option>
                    <option>Барбадос</option>
                    <option>Бахрейн</option>
                    <option>Беларусь</option>
                    <option>Белиз</option>
                    <option>Бельгия</option>
                    <option>Бенин</option>
                    <option>Бермуды</option>
                    <option>Болгария</option>
                    <option>Боливия</option>
                    <option>Босния/Герцеговина</option>
                    <option>Ботсвана</option>
                    <option>Бразилия</option>
                    <option>Британские Виргинские о-ва</option>
                    <option>Бруней</option>
                    <option>Буркина Фасо</option>
                    <option>Бурунди</option>
                    <option>Бутан</option>
                    <option>Вануату</option>
                    <option>Ватикан</option>
                    <option>Великобритания</option>
                    <option>Венгрия</option>
                    <option>Венесуэла</option>
                    <option>Вьетнам</option>
                    <option>Габон</option>
                    <option>Гаити</option>
                    <option>Гайана</option>
                    <option>Гамбия</option>
                    <option>Гана</option>
                    <option>Гваделупа</option>
                    <option>Гватемала</option>
                    <option>Гвинея</option>
                    <option>Гвинея-Бисау</option>
                    <option>Германия</option>
                    <option>Гернси остров</option>
                    <option>Гибралтар</option>
                    <option>Гондурас</option>
                    <option>Гонконг</option>
                    <option>Государство Палестина</option>
                    <option>Гренада</option>
                    <option>Гренландия</option>
                    <option>Греция</option>
                    <option>Грузия</option>
                    <option>ДР Конго</option>
                    <option>Дания</option>
                    <option>Джерси остров</option>
                    <option>Джибути</option>
                    <option>Доминиканская Республика</option>
                    <option>Египет</option>
                    <option>Замбия</option>
                    <option>Западная Сахара</option>
                    <option>Зимбабве</option>
                    <option>Израиль</option>
                    <option>Индия</option>
                    <option>Индонезия</option>
                    <option>Иордания</option>
                    <option>Ирак</option>
                    <option>Иран</option>
                    <option>Ирландия</option>
                    <option>Исландия</option>
                    <option>Испания</option>
                    <option>Италия</option>
                    <option>Йемен</option>
                    <option>Кабо-Верде</option>
                    <option>Казахстан</option>
                    <option>Камбоджа</option>
                    <option>Камерун</option>
                    <option>Канада</option>
                    <option>Катар</option>
                    <option>Кения</option>
                    <option>Кипр</option>
                    <option>Китай</option>
                    <option>Колумбия</option>
                    <option>Коста-Рика</option>
                    <option>Куба</option>
                    <option>Кувейт</option>
                    <option>Кука острова</option>
                    <option>Кыргызстан</option>
                    <option>Лаос</option>
                    <option>Латвия</option>
                    <option>Лесото</option>
                    <option>Либерия</option>
                    <option>Ливан</option>
                    <option>Ливия</option>
                    <option>Литва</option>
                    <option>Лихтенштейн</option>
                    <option>Люксембург</option>
                    <option>Маврикий</option>
                    <option>Мавритания</option>
                    <option>Мадагаскар</option>
                    <option>Македония</option>
                    <option>Малайзия</option>
                    <option>Мали</option>
                    <option>Мальдивские острова</option>
                    <option>Мальта</option>
                    <option>Марокко</option>
                    <option>Мексика</option>
                    <option>Мозамбик</option>
                    <option>Молдова</option>
                    <option>Монако</option>
                    <option>Монголия</option>
                    <option>Мьянма (Бирма)</option>
                    <option>Мэн о-в</option>
                    <option>Намибия</option>
                    <option>Непал</option>
                    <option>Нигер</option>
                    <option>Нигерия</option>
                    <option>Нидерланды (Голландия)</option>
                    <option>Никарагуа</option>
                    <option>Новая Зеландия</option>
                    <option>Новая Каледония</option>
                    <option>Норвегия</option>
                    <option>О.А.Э.</option>
                    <option>Оман</option>
                    <option>Пакистан</option>
                    <option>Палау</option>
                    <option>Панама</option>
                    <option>Папуа Новая Гвинея</option>
                    <option>Парагвай</option>
                    <option>Перу</option>
                    <option>Питкэрн остров</option>
                    <option>Польша</option>
                    <option>Португалия</option>
                    <option>Пуэрто Рико</option>
                    <option>Республика Конго</option>
                    <option>Реюньон</option>
                    <option>Руанда</option>
                    <option>Румыния</option>
                    <option>США</option>
                    <option>Сальвадор</option>
                    <option>Самоа</option>
                    <option>Сан-Марино</option>
                    <option>Сан-Томе и Принсипи</option>
                    <option>Саудовская Аравия</option>
                    <option>Свазиленд</option>
                    <option>Святая Люсия</option>
                    <option>Северная Корея</option>
                    <option>Сейшеллы</option>
                    <option>Сен-Пьер и Микелон</option>
                    <option>Сенегал</option>
                    <option>Сент Китс и Невис</option>
                    <option>Сент-Винсент и Гренадины</option>
                    <option>Сербия</option>
                    <option>Сингапур</option>
                    <option>Сирия</option>
                    <option>Словакия</option>
                    <option>Словения</option>
                    <option>Соломоновы острова</option>
                    <option>Сомали</option>
                    <option>Судан</option>
                    <option>Суринам</option>
                    <option>Сьерра-Леоне</option>
                    <option>Таджикистан</option>
                    <option>Таиланд</option>
                    <option>Тайвань</option>
                    <option>Танзания</option>
                    <option>Того</option>
                    <option>Токелау острова</option>
                    <option>Тонга</option>
                    <option>Тринидад и Тобаго</option>
                    <option>Тувалу</option>
                    <option>Тунис</option>
                    <option>Туркменистан</option>
                    <option>Туркс и Кейкос</option>
                    <option>Турция</option>
                    <option>Уганда</option>
                    <option>Узбекистан</option>
                    <option>Украина</option>
                    <option>Уоллис и Футуна острова</option>
                    <option>Уругвай</option>
                    <option>Фарерские острова</option>
                    <option>Фиджи</option>
                    <option>Филиппины</option>
                    <option>Финляндия</option>
                    <option>Франция</option>
                    <option>Французская Полинезия</option>
                    <option>Хорватия</option>
                    <option>Чад</option>
                    <option>Черногория</option>
                    <option>Чехия</option>
                    <option>Чили</option>
                    <option>Швейцария</option>
                    <option>Швеция</option>
                    <option>Шри-Ланка</option>
                    <option>Эквадор</option>
                    <option>Экваториальная Гвинея</option>
                    <option>Эритрея</option>
                    <option>Эстония</option>
                    <option>Эфиопия</option>
                    <option>ЮАР</option>
                    <option>Южная Корея</option>
                    <option>Южная Осетия</option>
                    <option>Ямайка</option>
                    <option>Япония</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 sm:px-6">
              <button
                type="submit"
                className={clsx(
                  isSubmitting ? 'loading' : '',
                  'btn btn-primary btn-sm w-full flex justify-center py-2 px-4'
                )}
                disabled={isSubmitting || profileError}
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

export default ProfileForm
