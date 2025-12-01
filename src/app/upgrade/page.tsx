'use client'

import { CheckCircle2, Zap, Crown, Star, ArrowLeft, ShieldCheck } from 'lucide-react'
import { PaystackButton } from 'react-paystack'
import { upgradeToPro } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UpgradePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const componentProps = {
    email,
    amount: 1500 * 100, // 1500 Naira in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    text: "Upgrade Now - ₦1,500/mo",
    onSuccess: async () => {
      toast.success("Welcome to Pro! 🚀")
      await upgradeToPro()
      router.push('/dashboard')
      router.refresh()
    },
    onClose: () => toast.info("Maybe next time!"),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-medium">Loading your offer...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Crown className="mr-2 h-4 w-4" />
            Most Vendors Choose Pro
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Unlock Your Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Full Potential</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Stop limiting your sales. Get unlimited inventory, priority support, and advanced insights for less than the price of a snack.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Free Plan Card */}
          <div className="rounded-3xl border bg-card/50 p-8 opacity-70 hover:opacity-100 transition-opacity">
            <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold">₦0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 mr-3" />
                Up to 15 Items
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 mr-3" />
                Basic Tracking
              </li>
              <li className="flex items-center text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 mr-3" />
                Community Support
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </div>

          {/* Pro Plan Card */}
          <div className="relative rounded-3xl border-2 border-amber-500/50 bg-card/80 backdrop-blur-xl p-8 shadow-2xl shadow-amber-500/10 transform hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              RECOMMENDED
              <Star className="h-3 w-3 fill-current" />
            </div>

            <h3 className="text-xl font-semibold mb-2 text-amber-600 dark:text-amber-400">Pro Plan</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold tracking-tight">₦1,500</span>
              <span className="text-lg text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center font-medium">
                <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                Unlimited Items
              </li>
              <li className="flex items-center font-medium">
                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600">
                  <Zap className="h-4 w-4" />
                </div>
                Priority Support
              </li>
              <li className="flex items-center font-medium">
                <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 text-purple-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                Advanced Security
              </li>
              <li className="flex items-center font-medium">
                <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 text-orange-600">
                  <Star className="h-4 w-4" />
                </div>
                Early Access to Features
              </li>
            </ul>

            <div className="w-full">
              {/* @ts-ignore */}
              <PaystackButton 
                {...componentProps} 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
              />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Secure payment via Paystack. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Social Proof / Trust */}
        <div className="mt-20 text-center space-y-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Trusted by 100+ Vendors</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos */}
            <div className="h-8 w-24 bg-foreground/20 rounded"></div>
            <div className="h-8 w-24 bg-foreground/20 rounded"></div>
            <div className="h-8 w-24 bg-foreground/20 rounded"></div>
            <div className="h-8 w-24 bg-foreground/20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
