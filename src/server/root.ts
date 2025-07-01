import { exampleRouter } from './routers/example-router'
import { urlRouter } from './routers/url-router'
import { router } from './trpc'

export const appRouter = router({
  example: exampleRouter,
  url: urlRouter
})

export type AppRouter = typeof appRouter
