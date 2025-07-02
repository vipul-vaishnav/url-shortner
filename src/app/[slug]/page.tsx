import { urlRouterCaller } from '@/server/routers/url-router'
import { TRPCError } from '@trpc/server'
import { notFound, redirect } from 'next/navigation'

export default async function Slug({ params }: { params: { slug: string } }) {
  let destinationUrlVal: string
  try {
    const { slug } = params
    const { destinationUrl } = await urlRouterCaller.getUrlBySlug(slug)

    destinationUrlVal = destinationUrl
  } catch (error: unknown) {
    console.error('Error while resolving slug:', error)

    if (error instanceof TRPCError && error?.code === 'NOT_FOUND') {
      return notFound()
    }

    return notFound()
  }

  redirect(destinationUrlVal)
}
