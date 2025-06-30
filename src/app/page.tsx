import UrlForm from '@/components/url-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center sm:px-24 py-22 px-8">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center">⚡ ZURL - URL Shortener</h1>
      <p className="mt-4 text-lg font-medium text-center text-muted-foreground">Welcome to the ZURL URL Shortener!</p>
      <UrlForm />
    </main>
  )
}
