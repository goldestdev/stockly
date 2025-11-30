'use client'

import { Item } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateQuantity } from '@/app/actions'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface InventoryListProps {
  items: Item[]
}

export function InventoryList({ items: initialItems }: InventoryListProps) {
  const [items, setItems] = useState<Item[]>(initialItems)

  const handleUpdate = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return
    
    setItems(items.map(i => i.id === id ? { ...i, quantity: newQuantity } : i))
    
    const error = await updateQuantity(id, newQuantity)
    if (error) {
      console.error(error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <PackageOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No items yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
          Start tracking your inventory by adding your first item.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const isLowStock = item.quantity <= item.low_stock_threshold
        const isOut = item.quantity === 0

        return (
          <li 
            key={item.id} 
            className={cn(
              "flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all",
              isLowStock && "border-red-100 bg-red-50/30"
            )}
          >
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground truncate">{item.name}</p>
                {isOut ? (
                   <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Sold Out</Badge>
                ) : isLowStock ? (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px] bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Low Stock</Badge>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {item.selling_price ? `₦${item.selling_price.toLocaleString()}` : 'No price'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-background rounded-lg border p-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md hover:bg-muted"
                onClick={() => handleUpdate(item.id, item.quantity - 1)}
                disabled={item.quantity <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className={cn(
                "w-8 text-center font-mono font-medium",
                isLowStock ? "text-red-600" : "text-foreground"
              )}>
                {item.quantity}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md hover:bg-muted"
                onClick={() => handleUpdate(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
