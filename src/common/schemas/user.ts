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

export const userIdSchema = z.object({
  userId: z.string().nonempty({ message: 'Введите ID пользователя' }).trim(),
})

export const updateUserSchema = z.object({
  newUserId: z.string().nonempty({ message: 'Введите ID пользователя' }).trim(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z.string().trim().optional(),
  password: z.string().trim().optional(),
})

export const updateProfileSchema = z.object({
  status: z.string().trim().optional(),
  position: z.string().trim().optional(),
  company: z.string().trim().optional(),
  country: z.string().trim().optional(),
  education: z.string().trim().optional(),
  about: z.string().trim().optional(),
})

export const createEmployementSchema = z.object({
  company: z.string().nonempty({ message: 'Введите компанию' }).trim(),
  position: z.string().nonempty({ message: 'Введите должность' }).trim(),
  employedOn: z.string().nonempty({ message: 'Введите дату' }).trim(),
})

export const deleteEmployementSchema = z.object({
  employementId: z.string().nonempty({ message: 'Введите ID' }).trim(),
})

export const fileUploadSchema = z.object({
  image: z.instanceof(Blob),
})

export type ILogin = z.infer<typeof loginSchema>
export type IRegister = z.infer<typeof registerSchema>
export type IUserId = z.infer<typeof userIdSchema>
export type IUpdateUser = z.infer<typeof updateUserSchema>
export type IUpdateProfile = z.infer<typeof updateProfileSchema>
export type ICreateEmployement = z.infer<typeof createEmployementSchema>
export type IDeleteEmployement = z.infer<typeof deleteEmployementSchema>
export type IFileUpload = z.infer<typeof fileUploadSchema>
