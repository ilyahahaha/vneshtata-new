import { trpc } from '@/common/trpc'
import Dialog from '@/components/chat/Dialog'
import useSession from '@/hooks/useSession'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const ChatDialog: NextPage = () => {
  const router = useRouter()

  const {
    data: dialerData,
    isLoading: isDialerLoading,
    isError: isDialerError,
  } = trpc.user.getUser.useQuery({ userId: router.query.userId as string })

  const { session, isLoading: isSessionLoading } = useSession()
  const {
    data: messageData,
    isLoading: isMessagesLoading,
    isError,
  } = trpc.chat.getMessages.useQuery({ userId: router.query.userId as string })

  if (isMessagesLoading || isSessionLoading || isDialerLoading) {
    return <h1>Загрузка</h1>
  }

  if (!messageData || !session || !dialerData || isError || isDialerError) {
    return <h1>Ошибка</h1>
  }

  const dialer = dialerData.result.user
  const messages = messageData.result.messages

  return (
    <>
      <div className="block pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Сообщения</h1>
      </div>
      <div className="border rounded-md border-gray-200">
        <Dialog
          user={{
            id: session.id,
            firstName: session.firstName,
            lastName: session.lastName,
            picture: session.picture,
          }}
          dialer={{
            id: dialer.id,
            firstName: dialer.firstName,
            lastName: dialer.lastName,
            picture: dialer.picture,
          }}
          messages={messages}
        />
      </div>
    </>
  )
}

export default ChatDialog
