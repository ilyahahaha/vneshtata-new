import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import type { NextPage } from 'next'
import { useState } from 'react'

const Auth: NextPage = () => {
  const [action, setAction] = useState<'login' | 'register'>('login')

  return (
    <div className="flex h-[calc(65dvh)] px-4 items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {action === 'register' ? 'Регистрация аккаунта' : 'Вход в аккаунт'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            или{' '}
            <a
              href="#"
              onClick={() => {
                if (action === 'login') setAction('register')
                if (action === 'register') setAction('login')
              }}
              className="font-medium text-primary"
            >
              {action === 'register' ? 'войдите в существующий' : 'создайте новый'}
            </a>
          </p>
        </div>

        {action === 'register' ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  )
}

export default Auth
