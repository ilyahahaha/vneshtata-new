import * as argon2 from 'argon2'
import prisma from '@/common/prisma'
import {
  createEmployement,
  deleteEmployement,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  updateUserSchema,
  userIdSchema,
} from '@/common/schemas/user'
import { EmptySession, User } from '@/common/session'
import { protectedProcedure, publicProcedure, router } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Companies } from '@prisma/client'

export const userRouter = router({
  session: publicProcedure.query(async ({ ctx }) => {
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
  getUser: protectedProcedure.input(userIdSchema).query(async ({ input }) => {
    const { userId } = input

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        picture: true,
        profile: {
          select: {
            status: true,
            position: true,
            company: true,
            country: true,
            education: true,
            about: true,
          },
        },
        previousEmployments: {
          select: {
            company: true,
            position: true,
            employedOn: true,
          },
        },
        followedBy: {
          select: {
            follower: {
              select: {
                id: true,
                firstName: true,
                picture: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Пользователь с указаным ID не найден' })
    }

    return { status: 200, message: 'Данные о пользователе получены', result: { user } }
  }),
  getBusiedIds: protectedProcedure.query(async () => {
    const ids = await prisma.user.findMany({ select: { id: true } })

    if (!ids) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Пользователи не найдены' })
    }

    return { status: 200, message: 'Данные о пользователях получены', result: { ids } }
  }),
  updateUser: protectedProcedure.input(updateUserSchema).mutation(async ({ ctx, input }) => {
    const { userId, newUserId, firstName, lastName, email, password } = input

    if (ctx.session.user?.id !== userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Вы не можете изменить другого пользователя',
      })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        id: newUserId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        hashedPassword: password ? await argon2.hash(password) : undefined,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Пользователь не найден',
      })
    }

    const userSession: User = {
      id: newUserId ? newUserId : ctx.session.user.id,
      email: email ? email : ctx.session.user.email,
      firstName: firstName ? firstName : ctx.session.user.firstName,
      lastName: lastName ? lastName : ctx.session.user.firstName,
      picture: ctx.session.user.picture,
      isLoggedIn: true,
    }

    ctx.session.user = userSession
    await ctx.session.save()

    return { status: 201, message: 'Пользователь обновлен', result: { userSession } }
  }),
  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    const { userId, status, position, company, country, education, about } = input

    if (ctx.session.user?.id !== userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Вы не можете изменить другого пользователя',
      })
    }

    const profile = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            status: status,
            position: position,
            company: company,
            country: country,
            education: education,
            about: about,
          },
        },
      },
      select: {
        profile: {
          select: {
            status: true,
            position: true,
            company: true,
            country: true,
            education: true,
            about: true,
          },
        },
      },
    })

    if (!profile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Пользователь не найден',
      })
    }

    return { status: 201, message: 'Профиль обновлен', result: { profile } }
  }),
  createEmployement: protectedProcedure
    .input(createEmployement)
    .mutation(async ({ ctx, input }) => {
      const { userId, company, position, employedOn } = input

      if (ctx.session.user?.id !== userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Вы не можете изменить другого пользователя',
        })
      }

      if (!(company in Companies))
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Неверные параметры запроса',
        })

      const employement = await prisma.employment.create({
        data: {
          company: company as Companies,
          position: position,
          employedOn: employedOn,
          employeeUserId: userId,
        },
      })

      if (!employement)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ошибка на стороне клиента',
        })

      return { status: 201, message: 'Опыт работы обновлен', result: { employement } }
    }),
  deleteEmployement: protectedProcedure
    .input(deleteEmployement)
    .mutation(async ({ ctx, input }) => {
      const { userId, employementId } = input

      if (ctx.session.user?.id !== userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Вы не можете изменить другого пользователя',
        })
      }

      const employement = await prisma.employment.delete({
        where: {
          id: employementId,
        },
      })

      if (!employement)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Должности не существует',
        })

      return { status: 201, message: 'Должность удалена', result: {} }
    }),
})
