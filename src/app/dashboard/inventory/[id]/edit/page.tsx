'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Package, Hash, Tag, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { updateItem } from '@/app/actions'
import { useState, useEffect, use } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Item } from '@/types'

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [item, setItem] = useState<Item | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Failed to load item')
        router.push('/dashboard/inventory')
        return
      }

      setItem(data)
      setFetching(false)
    }

    fetchItem()
  }, [id, router, supabase])

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const result = await updateItem(id, formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Item updated successfully')
      router.push('/dashboard/inventory')
      router.refresh()
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      <header className="flex items-center gap-4">
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Item</h1>
          <p className="text-muted-foreground">Update details for {item.name}</p>
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
              type="text"
              name="name"
              id="name"
              required
              defaultValue={item.name}
              placeholder="e.g. Nike Air Force 1"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium leading-none flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Quantity
            </label>
            <Input
              type="number"
              name="quantity"
              id="quantity"
              required
              min="0"
              defaultValue={item.quantity}
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
                  type="number"
                  name="cost_price"
                  id="cost_price"
                  min="0"
                  step="0.01"
                  defaultValue={item.cost_price || ''}
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
                  type="number"
                  name="selling_price"
                  id="selling_price"
                  min="0"
                  step="0.01"
                  defaultValue={item.selling_price || ''}
                  placeholder="0.00"
                  className="pl-7 bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Changes...
                </div>
              ) : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
