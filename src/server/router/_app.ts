import { router } from '@/server/trpc'
import { userRouter } from '@/server/router/user'
import { chatRouter } from './chat'
import { postRouter } from './post'

export const appRouter = router({
  user: userRouter,
  chat: chatRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
