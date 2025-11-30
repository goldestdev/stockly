'use client'

import { Button } from '@/components/ui/button'
import { sendLowStockAlerts } from '@/app/actions'
import { Bell } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export function TestAlertButton() {
  const [loading, setLoading] = useState(false)

  const handleTestAlert = async () => {
    setLoading(true)
    const result = await sendLowStockAlerts()
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(result?.message || 'Alert sent!')
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleTestAlert}
      disabled={loading}
      className="gap-2"
    >
      <Bell className="h-4 w-4" />
      {loading ? 'Sending...' : 'Test Alert'}
    </Button>
  )
}
