'use client'

import { Item } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, PackageOpen, MoreVertical, Trash, Pencil, CheckSquare, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateQuantity, deleteItem, deleteItems } from '@/app/actions'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import Link from 'next/link'

interface InventoryListProps {
  items: Item[]
}

export function InventoryList({ items: initialItems }: InventoryListProps) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const handleUpdate = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return
    
    setItems(items.map(i => i.id === id ? { ...i, quantity: newQuantity } : i))
    
    const error = await updateQuantity(id, newQuantity)
    if (error) {
      console.error(error)
      toast.error('Failed to update quantity')
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteItem(id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Item deleted')
      setItems(items.filter(i => i.id !== id))
      if (selectedItems.has(id)) {
        const newSelected = new Set(selectedItems)
        newSelected.delete(id)
        setSelectedItems(newSelected)
      }
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(items.map(i => i.id)))
    }
  }

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedItems)
    const result = await deleteItems(idsToDelete)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(`${idsToDelete.length} items deleted`)
      setItems(items.filter(i => !selectedItems.has(i.id)))
      setSelectedItems(new Set())
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
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={toggleSelectAll}
          >
            {selectedItems.size === items.length && items.length > 0 ? (
              <CheckSquare className="mr-2 h-4 w-4 text-primary" />
            ) : (
              <Square className="mr-2 h-4 w-4" />
            )}
            Select All
          </Button>
          {selectedItems.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedItems.size} selected
            </span>
          )}
        </div>
        
        {selectedItems.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {selectedItems.size} items from your inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const isLowStock = item.quantity <= item.low_stock_threshold
          const isOut = item.quantity === 0
          const isSelected = selectedItems.has(item.id)

          return (
            <li 
              key={item.id} 
              className={cn(
                "flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all",
                isLowStock && "border-red-100 bg-red-50/30",
                isSelected && "border-primary/50 bg-primary/5"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                <div 
                  className="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => toggleSelect(item.id)}
                >
                  {isSelected ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
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
              </div>
              
              <div className="flex items-center gap-2">
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/items/${item.id}/edit`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600 focus:text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
