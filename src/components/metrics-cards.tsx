import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Wallet } from "lucide-react"

interface MetricsProps {
  items: any[]
  sales: any[]
}

export function MetricsCards({ items, sales }: MetricsProps) {
  const totalInventoryCost = items.reduce((acc, item) => {
    return acc + (item.quantity * (item.cost_price || 0))
  }, 0)

  const totalRevenue = sales.reduce((acc, sale) => {
    return acc + sale.total_price
  }, 0)

  const totalItemsSold = sales.reduce((acc, sale) => {
    return acc + sale.quantity
  }, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <DollarSign className="h-24 w-24 text-blue-500" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Revenue</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total earnings from sales
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp className="h-24 w-24 text-emerald-500" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Items Sold</CardTitle>
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {totalItemsSold}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total units sold
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-background shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet className="h-24 w-24 text-purple-500" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Inventory Value</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{formatCurrency(totalInventoryCost)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Cost of stock on hand
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
