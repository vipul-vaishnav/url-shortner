import { urlRouterCaller } from '@/server/routers/url-router'
import { notFound, redirect } from 'next/navigation'

export default async function Slug({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const { destinationUrl } = await urlRouterCaller.getUrlBySlug(slug)

  if (!destinationUrl) {
    notFound()
  }

  redirect(destinationUrl)
}
