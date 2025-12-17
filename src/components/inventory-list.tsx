'use client'

import { Item } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, PackageOpen, MoreVertical, Trash, Pencil, CheckSquare, Square, DollarSign, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateQuantity, deleteItem, deleteItems, recordSale } from '@/app/actions'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import Link from 'next/link'

interface InventoryListProps {
  items: Item[]
}

export function InventoryList({ items: initialItems }: InventoryListProps) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [itemToSell, setItemToSell] = useState<Item | null>(null)
  const [sellQuantity, setSellQuantity] = useState(1)
  const [isSelling, setIsSelling] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    switch (filterType) {
      case 'low_stock':
        return item.quantity <= item.low_stock_threshold
      case 'out_of_stock':
        return item.quantity === 0
      default:
        return true
    }
  })

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

  const onSellClick = (item: Item) => {
    setItemToSell(item)
    setSellQuantity(1)
  }

  const confirmSale = async () => {
    if (!itemToSell) return

    if (sellQuantity <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }

    if (sellQuantity > itemToSell.quantity) {
      toast.error('Insufficient stock')
      return
    }

    setIsSelling(true)
    const result = await recordSale(itemToSell.id, sellQuantity, itemToSell.selling_price || 0)
    setIsSelling(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Sale recorded!')
      // Update local state
      setItems(items.map(i => i.id === itemToSell.id ? { ...i, quantity: i.quantity - sellQuantity } : i))
      setItemToSell(null)
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

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter: {filterType === 'all' ? 'All Items' : filterType === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('low_stock')}>
                Low Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('out_of_stock')}>
                Out of Stock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="gap-2" disabled>
            <Filter className="h-4 w-4" />
            Filter: All Items
          </Button>
        )}
      </div>

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
        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No items found matching your search.
          </div>
        )}
        {filteredItems.map((item) => {
          const isLowStock = item.quantity <= item.low_stock_threshold
          const isOut = item.quantity === 0
          const isSelected = selectedItems.has(item.id)

          return (
            <li
              key={item.id}
              className={cn(
                "flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all overflow-hidden",
                isLowStock && !isOut && "border-l-4 border-l-red-500 bg-red-50/10", // Left border accent for low stock
                isOut && "border-l-4 border-l-gray-500 opacity-75", // Formatting for sold out
                isSelected && "border-primary/50 bg-primary/5"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
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
                    <p className="font-semibold text-foreground line-clamp-2 leading-tight">{item.name}</p>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <p className="text-sm text-muted-foreground">
                      {item.selling_price ? `₦${item.selling_price.toLocaleString()}` : 'No price'}
                    </p>
                    {isOut ? (
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-muted-foreground border-muted-foreground">Sold Out</Badge>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                        Low Stock
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-0.5 sm:gap-3 bg-background rounded-lg border p-0.5 sm:p-1 shadow-sm">
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
                    <Link href={`/dashboard/inventory/${item.id}/edit`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => onSellClick(item)} className="cursor-pointer">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Record Sale
                    </DropdownMenuItem>
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


      <Dialog open={!!itemToSell} onOpenChange={(open) => !open && setItemToSell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Sale</DialogTitle>
            <DialogDescription>
              Record a sale for {itemToSell?.name}. This will deduct from your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={sellQuantity}
                onChange={(e) => setSellQuantity(parseInt(e.target.value) || 0)}
                className="col-span-3"
                min={1}
                max={itemToSell?.quantity}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Price</Label>
              <div className="col-span-3 font-semibold">
                {itemToSell && (
                  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
                    .format(sellQuantity * (itemToSell.selling_price || 0))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemToSell(null)}>Cancel</Button>
            <Button onClick={confirmSale} disabled={isSelling}>
              {isSelling ? 'Recording...' : 'Confirm Sale'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
