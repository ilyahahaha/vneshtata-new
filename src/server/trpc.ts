import { Context } from '@/server/context'
import { TRPCError, initTRPC } from '@trpc/server'

const t = initTRPC.context<Context>().create()

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts
  if (!ctx.session.user?.isLoggedIn) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Вы не авторизованы' })
  }
  return opts.next({
    ctx: {
      session: ctx.session,
    },
  })
})

export const router = t.router

export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(isAuthed)
