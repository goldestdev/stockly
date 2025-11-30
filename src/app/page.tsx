import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-primary">Stockly</div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
          Simple Inventory for Vendors
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-6">
          Stop Losing Sales. <br />
          <span className="text-primary">Start Tracking Stock.</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          The dead-simple inventory tracker for vendors who sell clothes, shoes, wigs, and perfumes. 
          No complex features, just what you need to keep selling.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
              Start for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full text-left">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Stock Instantly</h3>
            <p className="text-gray-500">Know exactly what you have. Update quantities with a single tap as you sell.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Low Stock Alerts</h3>
            <p className="text-gray-500">Never run out of best-sellers. See what needs restocking before it's too late.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-500">Designed for your phone. Use it at the market, shop, or on the go.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
