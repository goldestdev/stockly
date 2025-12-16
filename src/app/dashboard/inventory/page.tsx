import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { InventoryList } from '@/components/inventory-list'
import { Button } from '@/components/ui/button'
import { Plus, Search, ScanBarcode } from 'lucide-react'
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
    <div className="space-y-4 pb-20">
      {/* Search Bar - Sticky on Mobile */}
      <div className="sticky top-[64px] z-20 pb-2 md:static md:top-0 bg-background/95 backdrop-blur-sm md:bg-transparent -mx-4 px-4 pt-2 md:mx-0 md:px-0 md:pt-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="h-12 w-full rounded-2xl border bg-secondary/30 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-background p-1.5 shadow-sm">
            <ScanBarcode className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">All Products ({items?.length || 0})</h2>
        <Link href="/dashboard/inventory/new">
          <Button size="sm" className="h-9 rounded-full px-4 text-xs font-semibold">
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </Link>
      </div>

      <InventoryList items={items || []} />
    </div>
  )
}
