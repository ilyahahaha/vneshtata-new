const NotFoundPage: React.FC = () => (
  <div className="sm:flex py-36">
    <p className="text-4xl font-extrabold text-primary sm:text-5xl">404</p>
    <div className="sm:ml-6">
      <div className="sm:border-l sm:border-gray-200 sm:pl-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Страница не найдена
        </h1>
        <p className="mt-1 text-base text-gray-500">Проверьте вашу адресную строку.</p>
      </div>
    </div>
  </div>
)

export default NotFoundPage
