import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { InventoryList } from '@/components/inventory-list'
import { Button } from '@/components/ui/button'
import { Plus, Search, Bell } from 'lucide-react'
import Link from 'next/link'

export default async function InventoryPage() {
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
    .order('created_at', { ascending: false })

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md px-6 pl-16 md:pl-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight">Inventory</h1>
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            Manage your stock and prices
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
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">All Items</h3>
              <p className="text-sm text-muted-foreground">
                {items?.length || 0} items in total
              </p>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="p-1">
              <InventoryList items={items || []} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
