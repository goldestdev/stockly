"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle2, Loader2, Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utils/supabase/client"
import { recordSale } from "@/app/actions"

interface Product {
    id: string
    name: string
    selling_price: number | null
    quantity: number
}

interface NewSaleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NewSaleDialog({ open, onOpenChange }: NewSaleDialogProps) {
    const [step, setStep] = useState<"select" | "confirm">("select")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)

    const supabase = createClient()

    // Fetch products when dialog opens or search changes
    useEffect(() => {
        if (open) {
            const fetchProducts = async () => {
                setLoading(true)
                let query = supabase
                    .from('items')
                    .select('id, name, selling_price, quantity')
                    .gt('quantity', 0) // Only show in-stock items
                    .order('name')
                    .limit(20)

                if (search) {
                    query = query.ilike('name', `%${search}%`)
                }

                const { data } = await query
                if (data) {
                    setProducts(data as Product[])
                }
                setLoading(false)
            }

            const timeoutId = setTimeout(fetchProducts, 300) // Debounce search
            return () => clearTimeout(timeoutId)
        }
    }, [open, search, supabase])

    const handleSelect = (product: Product) => {
        setSelectedProduct(product)
        setQuantity(1)
        setStep("confirm")
    }

    const handleConfirm = async () => {
        if (!selectedProduct) return

        setProcessing(true)
        const result = await recordSale(selectedProduct.id, quantity, selectedProduct.selling_price || 0)
        setProcessing(false)

        if (result?.error) {
            toast.error("Sale Failed", { description: result.error })
            return
        }

        toast.success("Sale Recorded!", {
            description: `Sold ${quantity} x ${selectedProduct.name}`,
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        })

        // Smooth reset
        setTimeout(() => {
            onOpenChange(false)
            setStep("select")
            setSelectedProduct(null)
            setQuantity(1)
            setSearch("")
        }, 500)
    }

    const handleBack = () => {
        setStep("select")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md top-[50%] translate-y-[-50%] sm:top-[50%]">
                <DialogHeader>
                    <DialogTitle>{step === "select" ? "Select Product" : "Confirm Sale"}</DialogTitle>
                    <DialogDescription>
                        {step === "select" ? "Choose item to sell" : "Verify quantity and price"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <AnimatePresence mode="wait">
                        {step === "select" ? (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-9 h-12 bg-secondary/20 border-0"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 min-h-[200px]">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                            <span className="text-sm">No items found</span>
                                        </div>
                                    ) : (
                                        products.map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => handleSelect(product)}
                                                className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 cursor-pointer transition-colors active:scale-[0.98]"
                                            >
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">{product.quantity} in stock</p>
                                                </div>
                                                <div className="font-semibold text-primary">
                                                    ₦{(product.selling_price || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {selectedProduct && (
                                    <div className="text-center space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                                            <p className="text-2xl font-bold text-primary">₦{((selectedProduct.selling_price || 0) * quantity).toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center justify-center gap-6">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-12 w-12 rounded-full border-2"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                <Minus className="h-6 w-6" />
                                            </Button>
                                            <span className="text-4xl font-bold w-12 text-center">{quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-12 w-12 rounded-full border-2"
                                                onClick={() => setQuantity(Math.min(selectedProduct.quantity, quantity + 1))}
                                            >
                                                <Plus className="h-6 w-6" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedProduct.quantity - quantity} items will remain
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-row">
                    {step === "confirm" && (
                        <>
                            <Button variant="ghost" onClick={handleBack} className="w-full sm:w-auto" disabled={processing}>
                                Back
                            </Button>
                            <Button onClick={handleConfirm} size="lg" disabled={processing} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-orange-500/20">
                                {processing ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing</>) : "Confirm Sale"}
                            </Button>
                        </>
                    )}
                    {step === "select" && (
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
