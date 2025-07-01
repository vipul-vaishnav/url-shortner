import { urlRouterCaller } from '@/server/routers/url-router'
import { notFound, redirect } from 'next/navigation'

type Params = Promise<{ slug: string }>

export default async function Slug(props: { params: Params }) {
  const { slug } = await props.params

  const { destinationUrl } = await urlRouterCaller.getUrlBySlug(slug)

  if (!destinationUrl) {
    notFound()
  }

  redirect(destinationUrl)
}
