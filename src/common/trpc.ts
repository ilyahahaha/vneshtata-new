import type { AppRouter } from '@/server/router/_app'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              const { ...headers } = ctx.req.headers
              return {
                ...headers,
              }
            }
            return {}
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: 1,
          },
        },
      },
    }
  },
  ssr: true,
})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
