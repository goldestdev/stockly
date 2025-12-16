import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { BottomNav } from "@/components/layout/bottom-nav"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="hidden md:block">
        <DashboardSidebar userEmail={user.email} plan={profile?.plan} />
      </div>

      <main className="md:pl-64 min-h-screen transition-all duration-200 ease-in-out">
        <div className="md:hidden">
          <Header />
        </div>
        <div className="px-4 py-4 md:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
