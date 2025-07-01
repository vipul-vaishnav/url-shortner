import * as z from 'zod/v4'

export const FormSchema = z.object({
  title: z.string().min(4, {
    message: 'Title must be at least 4 characters.'
  }),
  destinationUrl: z
    .url({
      protocol: /^https?$/,
      hostname: /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      error: 'Invalid URL format'
    })
    .refine(
      (ctx) => {
        if (!ctx.startsWith('http://')) {
          return true
        }
      },
      { error: 'URL must start with https://' }
    ),
  enableAnalytics: z.boolean()
})
