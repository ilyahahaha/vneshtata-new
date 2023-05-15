import type { User } from '@/common/session'
import { Fragment } from 'react'
import Image from 'next/image'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { HiMenu, HiX } from 'react-icons/hi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Avatar from '@/components/user/Avatar'
import { trpc } from '@/common/trpc'
import { TRPCError } from '@trpc/server'

const navigation = [
  { name: 'Лента', href: '/feed' },
  { name: 'Сообщения', href: '/chat' },
  { name: 'Биржа', href: 'https://rutube.ru/video/79fc73b8215c2371a64c71ab60b27b37/' },
]

const userNavigation = [
  { name: 'Профиль', href: '/user' },
  { name: 'Настройки', href: '/user/settings' },
]

const Navbar: React.FC<{ session: User; loading: boolean }> = ({ session, loading }) => {
  const router = useRouter()

  const logout = trpc.user.logout.useMutation()
  const userQueriesUtils = trpc.useContext()

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/">
                    <Image
                      className="block lg:hidden h-8 w-auto"
                      src="/vneshtata.svg"
                      alt="Внештата"
                      width="35"
                      height="32"
                    />
                    <Image
                      className="hidden lg:block h-8 w-auto"
                      src="/vneshtata-full.svg"
                      alt="Внештата"
                      width="143"
                      height="32"
                    />
                  </Link>
                </div>
                {!loading && session.isLoggedIn ? (
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              {!loading && session.isLoggedIn ? (
                <Fragment>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          <span className="sr-only">Открыть меню</span>
                          <Avatar picture={session.picture} size={8} />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              <Link
                                href={item.href}
                                className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                              >
                                {item.name}
                              </Link>
                            </Menu.Item>
                          ))}

                          <Menu.Item key="signout">
                            <button
                              onClick={async () => {
                                try {
                                  const result = await logout.mutateAsync()
                                  userQueriesUtils.user.session.invalidate()

                                  toast.info(result.message)

                                  router.push('/auth')
                                } catch (error) {
                                  if (error instanceof TRPCError) {
                                    toast.error(error.message)
                                  }
                                }
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                            >
                              Выход
                            </button>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <span className="sr-only">Открыть меню</span>
                      {open ? (
                        <HiX className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <HiMenu className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </Fragment>
              ) : (
                <Link
                  href="/auth"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Авторизация
                </Link>
              )}
            </div>
          </div>

          {!loading && session.isLoggedIn ? (
            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button key={item.name} as="div">
                    <Link
                      className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      href={item.href}
                    >
                      {item.name}
                    </Link>
                  </Disclosure.Button>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Avatar picture={session.picture} size={10} />
                  </div>
                  <div className="ml-3">
                    <Fragment>
                      <div className="text-base font-medium text-gray-800">
                        {session.firstName} {session.lastName}
                      </div>
                      <div className="text-sm font-medium text-gray-500">{session.email}</div>
                    </Fragment>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button key={item.name} as="div">
                      <Link
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </Disclosure.Button>
                  ))}
                  <Disclosure.Button key="signout" as="div">
                    <button
                      onClick={async () => {
                        try {
                          const result = await logout.mutateAsync()
                          userQueriesUtils.user.session.invalidate()

                          toast.info(result.message)

                          router.push('/auth')
                        } catch (error) {
                          if (error instanceof TRPCError) {
                            toast.error(error.message)
                          }
                        }
                      }}
                      className="block px-4 py-2 w-full text-left text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Выход
                    </button>
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          ) : null}
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
