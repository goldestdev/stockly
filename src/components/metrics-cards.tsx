import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Wallet } from "lucide-react"

interface MetricsProps {
  items: any[]
}

export function MetricsCards({ items }: MetricsProps) {
  const totalCost = items.reduce((acc, item) => {
    return acc + (item.quantity * (item.cost_price || 0))
  }, 0)

  const totalRevenue = items.reduce((acc, item) => {
    return acc + (item.quantity * (item.selling_price || 0))
  }, 0)

  const potentialProfit = totalRevenue - totalCost

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
          <CardTitle className="text-sm font-medium">Total Inventory Cost</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
          <p className="text-xs text-muted-foreground">
            Value of stock on hand
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            If all items are sold
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
            {formatCurrency(potentialProfit)}
          </div>
          <p className="text-xs text-muted-foreground">
            Expected return
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
