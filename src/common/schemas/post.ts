import { z } from 'zod'

export const getPostsSchema = z.object({
  skip: z.number(),
})

export const addPostSchema = z.object({
  content: z.string().nonempty({ message: 'Введите текст поста' }).trim(),
})

export const likePostSchema = z.object({
  postId: z.string().nonempty({ message: 'Введите ID поста' }).trim(),
  dislike: z.boolean().optional(),
})

export const commentPostSchema = addPostSchema.extend({
  postId: z.string().nonempty({ message: 'Введите ID поста' }).trim(),
})

export type IGetPosts = z.infer<typeof getPostsSchema>
export type IAddPost = z.infer<typeof addPostSchema>
export type ILikePost = z.infer<typeof likePostSchema>
export type ICommentPost = z.infer<typeof commentPostSchema>
