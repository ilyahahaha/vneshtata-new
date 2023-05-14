import { trpc } from '@/common/trpc'
import Loading from '@/components/Loading'
import DialogList from '@/components/chat/DialogList'
import useSession from '@/hooks/useSession'
import { NextPage } from 'next'

const ChatDialogs: NextPage = () => {
  const { session, isLoading: isSessionLoading } = useSession()
  const { data: dialogData, isLoading: isDialogsLoading, isError } = trpc.chat.getDialogs.useQuery()

  if (isDialogsLoading || isSessionLoading) {
    return <Loading />
  }

  if (!dialogData || !session || isError) {
    return <h1>Ошибка</h1>
  }

  const dialogs = dialogData.result.dialogs

  return (
    <>
      <div className="block pb-5">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Сообщения</h1>
      </div>
      <div className="border rounded-md border-gray-200">
        <DialogList session={session} dialogs={dialogs} />
      </div>
    </>
  )
}

export default ChatDialogs
