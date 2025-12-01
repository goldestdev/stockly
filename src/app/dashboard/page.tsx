import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { InventoryList } from '@/components/inventory-list'
import { MetricsCards } from '@/components/metrics-cards'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">S</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Stockly</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {profile?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </p>
            </div>
          </div>

          <DashboardNav user={user} profile={profile} />
        </div>
      </header>
      
      <main className="container px-4 md:px-6 py-8 max-w-5xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {user.user_metadata.full_name?.split(' ')[0] || 'Vendor'}. Here's what's happening today.
            </p>
          </div>
          <Link href="/items/new">
            <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" />
              Add New Item
            </Button>
          </Link>
        </div>

        {/* Metrics */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <MetricsCards items={items || []} />
        </div>
        
        {/* Inventory List */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">Inventory Items</h3>
            <span className="text-sm text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full font-medium">
              {items?.length || 0} Total
            </span>
          </div>
          
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="p-1">
              <InventoryList items={items || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
