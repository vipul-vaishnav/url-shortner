'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/utils/trpc'

export default function Home() {
  const { data } = trpc.example.hello.useQuery({ text: 'Vipul' })
  return (
    <div className="h-screen flex items-center justify-center">
      <Button size={'lg'}>Click Me! {data?.greeting}</Button>
    </div>
  )
}
