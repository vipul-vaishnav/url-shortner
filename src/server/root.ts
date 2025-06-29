import { exampleRouter } from './routers/example-router'
import { router } from './trpc'

export const appRouter = router({
  example: exampleRouter
})

export type AppRouter = typeof appRouter
