import { PropsWithChildren } from 'react'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import { trpc } from '@/common/trpc'
import { useRouter } from 'next/router'
import Head from 'next/head'
import type { User } from '@/common/session'

const Layout = ({ children }: PropsWithChildren) => {
  const router = useRouter()
  const { data: session, isLoading, isError } = trpc.user.user.useQuery()

  if (isError) return router.push('/404')

  return (
    <>
      <Head>
        <title>Внештата | Социальная сеть для профессионалов</title>
        <meta name="description" content="Описание внештата." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <Navbar session={session as User} loading={isLoading} />
        <main className="max-w-7xl mx-auto px-5 py-8 md:px-7 xl:px-9">{children}</main>
        <Footer />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        className="text-black"
        pauseOnHover={false}
        closeButton={false}
      />
    </>
  )
}

export default Layout
