import type { NextPage } from 'next'
import Link from 'next/link'

const Index: NextPage = () => {
  return (
    <div className="hero py-36">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">Внештата.рф</h1>
          <p className="py-6">Социальная сеть для профессионалов.</p>
          <Link href="/auth" className="btn btn-primary">
            Перейти к авторизации
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Index
