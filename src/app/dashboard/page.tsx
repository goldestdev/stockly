import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MetricsCards } from '@/components/metrics-cards'
import { SalesChart } from '@/components/sales-chart'
import { RecentSales } from '@/components/recent-sales'
import { Button } from '@/components/ui/button'
import { Plus, Search, Bell } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardOverview() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: items } = await supabase
    .from('items')
    .select('*')

  // Fetch sales for the last 7 days for the chart
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: chartSales } = await supabase
    .from('sales')
    .select('created_at, total_price')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // Fetch all sales for metrics
  const { data: allSales } = await supabase
    .from('sales')
    .select('quantity, total_price')

  // Fetch recent sales with item details
  const { data: recentSales } = await supabase
    .from('sales')
    .select('*, items(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Aggregate sales by date for chart
  const salesData = (chartSales || []).reduce((acc: any[], sale) => {
    const date = new Date(sale.created_at).toLocaleDateString('en-US', { weekday: 'short' })
    const existing = acc.find(item => item.date === date)
    
    if (existing) {
      existing.amount += sale.total_price
    } else {
      acc.push({ date, amount: sale.total_price })
    }
    
    return acc
  }, [])

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md px-6 pl-16 md:pl-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <Link href="/dashboard/inventory/new">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.user_metadata.full_name?.split(' ')[0] || 'Vendor'} 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Metrics */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <MetricsCards items={items || []} sales={allSales || []} />
        </div>

        {/* Charts & Recent Sales */}
        <div className="grid gap-6 md:grid-cols-7 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <SalesChart data={salesData} />
          <RecentSales sales={recentSales || []} />
        </div>
      </div>
    </>
  )
}
