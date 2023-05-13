import * as argon2 from 'argon2'
import prisma from '@/common/prisma'
import { loginSchema, registerSchema } from '@/common/schemas/user'
import { EmptySession, User } from '@/common/session'
import { publicProcedure, router } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const userRouter = router({
  user: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session.user) {
      return {
        ...ctx.session.user,
        isLoggedIn: true,
      }
    } else {
      return EmptySession
    }
  }),
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const { email, password } = input

    const user = await prisma.user.findUnique({ where: { email: email } })

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Неверный email или пароль' })

    if (!(await argon2.verify(user.hashedPassword, password)))
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Неверный email или пароль' })

    const session: User = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
      isLoggedIn: true,
    }

    ctx.session.user = session
    await ctx.session.save()

    return {
      status: 201,
      message: 'Вы успешно авторизовались',
      result: { session },
    }
  }),
  register: publicProcedure.input(registerSchema).mutation(async ({ input, ctx }) => {
    try {
      const { firstName, lastName, email, password } = input

      const user = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          profile: { create: {} },
          hashedPassword: await argon2.hash(password),
        },
      })

      const session: User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: null,
        isLoggedIn: true,
      }

      ctx.session.user = session
      await ctx.session.save()

      return {
        status: 201,
        message: 'Вы успешно зарегистрировались',
        result: { session },
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Пользователь с таким email уже зарегистрирован',
          })
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Неизвестная ошибка: ${error.code}`,
        })
      }
    }
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy()

    return {
      status: 201,
      message: 'Вы вышли из аккаунта',
      result: { EmptySession },
    }
  }),
})
