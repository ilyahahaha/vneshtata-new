import { HiOutlineBookOpen, HiOutlineBriefcase, HiOutlineUserCircle } from 'react-icons/hi2'

const navigation = [
  { name: 'Аккаунт', href: '#account', icon: HiOutlineUserCircle },
  { name: 'Профиль', href: '#profile', icon: HiOutlineBookOpen },
  { name: 'Опыт работы', href: '#employee', icon: HiOutlineBriefcase },
]

const Sidebar: React.FC = () => {
  return (
    <aside className="py-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-gray-900 hover:text-gray-900 hover:bg-gray-50 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
          >
            <item.icon
              className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
              aria-hidden="true"
            />
            <span className="truncate">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
