import { router } from '@/server/trpc'
import { userRouter } from '@/server/router/user'
import { chatRouter } from './chat'

export const appRouter = router({
  user: userRouter,
  chat: chatRouter,
})

export type AppRouter = typeof appRouter
