import { z } from 'zod'

export const sendMessageSchema = z.object({
  senderId: z.string().nonempty({ message: 'Введите ID отправителя' }).trim(),
  receiverId: z.string().nonempty({ message: 'Введите ID получателя' }).trim(),
  content: z.string().nonempty({ message: 'Текст сообщения не может быть пустым' }).trim(),
})

export type ISendMessage = z.infer<typeof sendMessageSchema>
