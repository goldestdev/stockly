import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MetricsCards } from '@/components/metrics-cards'
import { SalesChart } from '@/components/sales-chart'
import { Button } from '@/components/ui/button'
import { Search, Bell, Download } from 'lucide-react'

export default async function AnalyticsPage() {
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
          <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            Detailed insights into your business performance
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
          <Button size="sm" variant="outline" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MetricsCards items={items || []} sales={allSales || []} />
        </div>

        <div className="grid gap-6 md:grid-cols-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <SalesChart data={salesData} />
        </div>
      </div>
    </>
  )
}
