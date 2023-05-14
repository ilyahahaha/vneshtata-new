import type { User } from '@/common/session'
import Link from 'next/link'
import Avatar from '@/components/user/Avatar'

const DialogList: React.FC<{
  session: User
  dialogs: {
    content: string
    sentAt: string
    sender: {
      picture: string | null
      firstName: string
      lastName: string
      id: string
    }
    receiver: {
      picture: string | null
      firstName: string
      lastName: string
      id: string
    }
  }[]
}> = ({ session, dialogs }) => {
  if (dialogs.length > 0) {
    return (
      <>
        <ul role="list" className="divide-y divide-gray-200 h-full">
          {dialogs
            .filter(function (_, index, __) {
              return index % 2 == 0
            })
            .map((user) => {
              const chatUser: {
                id: string
                firstName: string
                lastName: string
                picture: string | null
                lastMessage: string
              } = {
                id: user.sender.id === session.id ? user.receiver.id : user.sender.id,
                firstName:
                  user.sender.id === session.id ? user.receiver.firstName : user.sender.firstName,
                lastName:
                  user.sender.id === session.id ? user.receiver.lastName : user.sender.lastName,
                picture:
                  user.sender.id === session.id ? user.receiver.picture : user.sender.picture,
                lastMessage: user.content,
              }

              return (
                <Link href={`/chat/${chatUser.id}`} key={chatUser.id}>
                  <li className="py-4 px-6 xl:px-4 md:px-4 flex hover:bg-gray-200 hover:rounded-md">
                    <Avatar picture={chatUser.picture} size={10} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {chatUser.firstName} {chatUser.lastName}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">{chatUser.lastMessage}</p>
                    </div>
                  </li>
                </Link>
              )
            })}
        </ul>
      </>
    )
  }

  return <h1 className="text-center px-4 py-4">Диалогов не найдено</h1>
}

export default DialogList
