import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { InventoryList } from '@/components/inventory-list'
import { MetricsCards } from '@/components/metrics-cards'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { TestAlertButton } from '@/components/test-alert-button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-background">
      <div className="mx-auto max-w-md bg-white min-h-screen shadow-sm dark:bg-background">
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-4 flex items-center justify-between dark:bg-background dark:border-border">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-foreground">Stockly</h1>
            <p className="text-xs text-muted-foreground">Hi, {user.user_metadata.full_name?.split(' ')[0] || 'Vendor'}</p>
          </div>
          <div className="flex items-center gap-4">
            {profile?.plan === 'free' && (
              <Link href="/upgrade">
                <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Upgrade
                </Button>
              </Link>
            )}
            <ThemeToggle />
            <TestAlertButton />
            <form action="/auth/signout" method="post">
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </header>
        
        <main className="p-4">
          <div className="mx-auto max-w-md">
            <MetricsCards items={items || []} />
            
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Inventory</h2>
              <Link href="/items/new">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </Link>
            </div>
            
            <InventoryList items={items || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
