'use client'

import { addItem } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Package, Hash, DollarSign, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function AddItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const result = await addItem(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Item added successfully')
      router.push('/dashboard/inventory')
      router.refresh()
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      <header className="flex items-center gap-4">
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Item</h1>
          <p className="text-muted-foreground">Enter the details of your new stock.</p>
        </div>
      </header>

      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm p-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Item Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Nike Air Max 90"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium leading-none flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Quantity
            </label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              required
              min="0"
              defaultValue="1"
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cost_price" className="text-sm font-medium leading-none flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Cost Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <Input
                  id="cost_price"
                  name="cost_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7 bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="selling_price" className="text-sm font-medium leading-none flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Selling Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <Input
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7 bg-background/50"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding Item...
              </div>
            ) : 'Add Item'}
          </Button>
        </form>
      </div>
    </div>
  )
}
