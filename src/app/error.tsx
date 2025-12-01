'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-6 mb-6 animate-in zoom-in duration-500">
        <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-500" />
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Don't worry, your data is safe. Please try refreshing the page.
      </p>

      <div className="flex gap-4">
        <Button onClick={reset} size="lg" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
