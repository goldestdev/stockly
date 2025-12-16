import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowUpRight, TrendingUp, AlertTriangle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OnboardingView } from "@/components/onboarding-view"

export default async function DashboardOverview() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Fetch Total Inventory Count (Check for Onboarding)
  const { count: inventoryCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })

  // If no items, show Onboarding View
  if (inventoryCount === 0 || inventoryCount === null) {
    return <OnboardingView
      userName={user.user_metadata?.full_name || 'Vendor'}
      businessType={user.user_metadata?.business_type}
    />
  }

  // 2. Fetch Sales for Today (for Profit calculation)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todaysSales } = await supabase
    .from('sales')
    .select('total_price, quantity')
    .gte('created_at', today.toISOString())

  const profitToday = todaysSales?.reduce((acc, sale) => acc + sale.total_price, 0) || 0
  const salesCountToday = todaysSales?.reduce((acc, sale) => acc + sale.quantity, 0) || 0

  // 3. Fetch Low Stock Items
  const { data: lowStockItems } = await supabase
    .from('items')
    .select('id, name, quantity, low_stock_threshold')
    .order('quantity', { ascending: true })
    .limit(10)

  // Filter for actual low stock based on threshold in JS
  const alerts = lowStockItems?.filter(item => item.quantity <= (item.low_stock_threshold || 5)) || []


  // 4. Fetch Month Revenue
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const { data: monthSales } = await supabase
    .from('sales')
    .select('total_price')
    .gte('created_at', firstDayOfMonth.toISOString())

  const monthRevenue = monthSales?.reduce((acc, sale) => acc + sale.total_price, 0) || 0

  // 5. Fetch Recent Activity
  const { data: recentActivity } = await supabase
    .from('sales')
    .select('*, items(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Card: Today's Profit */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10B981] to-[#059669] p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-black/5 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-emerald-100 font-medium text-sm">Today's Profit</p>
              <h2 className="text-4xl font-bold tracking-tight">₦{profitToday.toLocaleString()}</h2>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-semibold backdrop-blur-md">
              <TrendingUp className="h-3 w-3" />
              <span>Today</span>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-emerald-100 text-xs mb-1">Items Sold Today</p>
              <p className="text-xl font-bold">{salesCountToday}</p>
            </div>
            <Link href="/dashboard/reports">
              <Button size="sm" variant="ghost" className="h-8 rounded-full bg-white/10 px-3 text-xs hover:bg-white/20 text-white">
                View Report <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-semibold text-lg text-foreground">Needs Attention</h3>
          <Link href="/dashboard/inventory?filter=low" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>

        {/* Horizontal Scroll for Alerts */}
        {alerts.length === 0 ? (
          <div className="p-4 rounded-xl border bg-card text-center text-sm text-muted-foreground">
            All stocks are healthy! 🚀
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {alerts.map((item) => (
              <div key={item.id} className="min-w-[240px] rounded-2xl border bg-card p-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle className="h-16 w-16 text-red-500 transform rotate-12" />
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Only <span className="font-bold text-red-600">{item.quantity}</span> left
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/dashboard/inventory`}>
                    <Button size="sm" className="w-full rounded-xl bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 shadow-none border-0 text-xs font-semibold h-8">
                      Restock Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-4 hover:shadow-md transition-shadow">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Package className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground">Inventory</p>
          <p className="text-2xl font-bold">{inventoryCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Items in stock</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 hover:shadow-md transition-shadow">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold">₦{monthRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">This Month</p>
        </div>
      </div>

      {/* Recent Activity Mini-List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-semibold text-lg text-foreground">Recent Activity</h3>
        </div>
        <div className="rounded-2xl border bg-card divide-y">
          {!recentActivity || recentActivity.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No recent sales</div>
          ) : (
            recentActivity.map((sale: any) => (
              <div key={sale.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {sale.items?.name.substring(0, 2) || 'UK'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sale.items?.name || 'Unknown Item'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">+ ₦{sale.total_price.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600">Sale ({sale.quantity})</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
