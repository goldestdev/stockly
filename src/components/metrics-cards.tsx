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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            Total earnings from sales
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalItemsSold}
          </div>
          <p className="text-xs text-muted-foreground">
            Total units sold
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInventoryCost)}</div>
          <p className="text-xs text-muted-foreground">
            Cost of stock on hand
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
