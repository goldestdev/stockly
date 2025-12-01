import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight } from "lucide-react"

interface RecentSalesProps {
  sales: {
    id: string
    quantity: number
    total_price: number
    created_at: string
    items: {
      name: string
    } | null
  }[]
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <Card className="col-span-3 border-none shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <CardDescription>
              You made {sales.length} sales this period
            </CardDescription>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No sales recorded yet.
            </div>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="flex items-center group">
                <Avatar className="h-9 w-9 ring-2 ring-background transition-all group-hover:ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {sale.items?.name.substring(0, 2).toUpperCase() || 'IT'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {sale.items?.name || 'Unknown Item'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.created_at).toLocaleDateString()} • {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="ml-auto font-medium tabular-nums">
                  +₦{sale.total_price.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
