import prisma from '@/common/prisma'
import { sendMessageSchema } from '@/common/schemas/chat'
import { userIdSchema } from '@/common/schemas/user'
import { protectedProcedure, router } from '@/server/trpc'

export const chatRouter = router({
  getDialogs: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id as string

    const dialogs = await prisma.message.findMany({
      distinct: ['receiverId', 'senderId'],
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        NOT: { AND: [{ receiverId: userId }, { senderId: userId }] },
      },
      select: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
        content: true,
        sentAt: true,
      },
      orderBy: { sentAt: 'desc' },
    })

    return { status: 200, message: 'Список диалогов получен', result: { dialogs } }
  }),

  getMessages: protectedProcedure.input(userIdSchema).query(async ({ input, ctx }) => {
    const { userId } = input

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: ctx.session.user?.id as string },
          { senderId: ctx.session.user?.id as string, receiverId: userId },
        ],
      },
      select: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
        content: true,
        sentAt: true,
      },
      orderBy: { sentAt: 'asc' },
    })

    return { status: 200, message: 'Список сообщений получен', result: { messages } }
  }),

  sendMessage: protectedProcedure.input(sendMessageSchema).mutation(async ({ input }) => {
    const { senderId, receiverId, content } = input

    const message = await prisma.message.create({
      data: { senderId: senderId, receiverId: receiverId, content: content },
    })

    return { status: 201, message: 'Сообщение отправлено', result: { message } }
  }),
})
