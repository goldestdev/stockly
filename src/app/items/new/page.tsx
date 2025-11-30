'use client'

import { addItem } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative overflow-hidden">
       {/* Background Pattern */}
       <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-md">
        <header className="mb-6 flex items-center gap-4">
          <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-gray-100 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Add New Item</h1>
        </header>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Item Name
              </label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Nike Air Max"
                  className="bg-background"
                />
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-foreground">
                Quantity
              </label>
              <div className="mt-1">
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  required
                  min="0"
                  defaultValue="1"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cost_price" className="block text-sm font-medium text-foreground">
                  Cost Price (Optional)
                </label>
                <div className="mt-1">
                  <Input
                    id="cost_price"
                    name="cost_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-background"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="selling_price" className="block text-sm font-medium text-foreground">
                  Selling Price (Optional)
                </label>
                <div className="mt-1">
                  <Input
                    id="selling_price"
                    name="selling_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
