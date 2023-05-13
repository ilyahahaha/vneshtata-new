import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Неверный email' })
    .nonempty({ message: 'Введите email' })
    .trim(),
  password: z.string().nonempty({ message: 'Введите пароль' }).trim(),
})

export const registerSchema = loginSchema.extend({
  firstName: z.string().nonempty({ message: 'Введите имя' }).trim(),
  lastName: z.string().nonempty({ message: 'Введите фамилию' }).trim(),
})

export type ILogin = z.infer<typeof loginSchema>
export type IRegister = z.infer<typeof registerSchema>
