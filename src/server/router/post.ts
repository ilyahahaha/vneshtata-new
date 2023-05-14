import prisma from '@/common/prisma'
import {
  addPostSchema,
  commentPostSchema,
  getPostsSchema,
  likePostSchema,
} from '@/common/schemas/post'
import { protectedProcedure, router } from '@/server/trpc'
import { TRPCError } from '@trpc/server'

export const postRouter = router({
  getPosts: protectedProcedure.input(getPostsSchema).query(async ({ ctx, input }) => {
    const userId = ctx.session.user?.id as string

    const { skip } = input

    const posts = await prisma.post.findMany({
      skip: skip,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        OR: [
          {
            author: {
              followedBy: { some: { followerId: userId } },
            },
          },
          {
            authorId: userId,
          },
        ],
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
        likes: {
          select: {
            likedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
              },
            },
          },
        },
        comments: false,
      },
    })

    return { status: 200, message: 'Посты получены', result: { posts } }
  }),
  getPostComments: protectedProcedure.input(likePostSchema).query(async ({ input }) => {
    const { postId } = input

    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
      },
    })

    return { status: 200, message: 'Комментарии получены', result: { comments } }
  }),
  addPost: protectedProcedure.input(addPostSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user?.id as string

    const { content } = input

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content: content,
      },
    })

    if (!post) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Неизвестная ошибка' })
    }

    return { status: 200, message: 'Пост опубликован', result: { post } }
  }),
  like: protectedProcedure.input(likePostSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user?.id as string

    const { postId, dislike } = input

    let like

    if (!dislike) {
      like = await prisma.likes.create({
        data: {
          postId: postId,
          likedById: userId,
        },
      })
    } else {
      like = await prisma.likes.delete({
        where: {
          postId_likedById: { postId: postId, likedById: userId },
        },
      })
    }

    if (!like) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Неизвестная ошибка' })
    }

    return { status: 200, message: !dislike ? 'Лайк поставлен' : 'Лайк убран', result: { like } }
  }),
  comment: protectedProcedure.input(commentPostSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user?.id as string

    const { postId, content } = input

    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        postId: postId,
        content: content,
      },
    })

    if (!comment) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Неизвестная ошибка' })
    }

    return { status: 200, message: 'Комментарий оставлен', result: { comment } }
  }),
})
