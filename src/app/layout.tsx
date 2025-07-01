import type { Metadata } from 'next'
import { Darker_Grotesque } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '@/components/TRPCProvider'
import { Toaster } from 'sonner'

const darkerGrotesque = Darker_Grotesque({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: '⚡ ZURL | URL Shortener',
  description: 'A simple URL shortener built with Next.js and MongoDB.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${darkerGrotesque.className} antialiased`}>
        <Toaster />
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
