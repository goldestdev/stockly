'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Zap } from 'lucide-react'
import { PaystackButton } from 'react-paystack'
import { upgradeToPro } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

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
    amount: 500 * 100, // 500 Naira in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    text: "Pay ₦500 / Month",
    onSuccess: async () => {
      toast.success("Payment successful! Upgrading your account...")
      await upgradeToPro()
      router.push('/dashboard')
      router.refresh()
    },
    onClose: () => toast.info("Payment cancelled"),
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Upgrade to Pro</h1>
          <p className="mt-2 text-gray-600">Unlock unlimited inventory tracking</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-baseline justify-center mb-8">
            <span className="text-5xl font-extrabold tracking-tight text-gray-900">₦500</span>
            <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" />
              <span className="text-gray-600">Unlimited Items</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" />
              <span className="text-gray-600">Priority Support</span>
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" />
              <span className="text-gray-600">Email Restock Alerts (Coming Soon)</span>
            </li>
          </ul>

          <div className="w-full">
             {/* @ts-ignore */}
            <PaystackButton 
              {...componentProps} 
              className="w-full h-11 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
            />
          </div>
          
          <p className="mt-4 text-center text-xs text-gray-500">
            Secure payment via Paystack. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
