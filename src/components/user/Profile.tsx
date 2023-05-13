const Profile: React.FC<{
  profile: {
    status: string | null
    position: string | null
    company: string | null
    country: string
    education: string | null
    about: string | null
  }
}> = ({ profile }) => {
  return (
    <section aria-labelledby="applicant-information-title">
      <div className="border rounded-md border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="applicant-information-title"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            Информация о пользователе
          </h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Должность</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.position ? profile.position : 'Не указана'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Место работы</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.company ? profile.company : 'Не указано'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Место учебы</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.education ? profile.education : 'Не указано'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Страна</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.country ? profile.country : 'Не указана'}
              </dd>
            </div>
            <div className="sm:col-span-2 w-full">
              <dt className="text-sm font-medium text-gray-500">О себе</dt>
              <dd className="mt-1 text-sm text-gray-900 break-words">
                {profile.about ? profile.about : 'Не указано'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default Profile
