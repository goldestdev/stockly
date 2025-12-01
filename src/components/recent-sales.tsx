import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No sales recorded yet.
            </div>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {sale.items?.name.substring(0, 2).toUpperCase() || 'IT'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{sale.items?.name || 'Unknown Item'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.created_at).toLocaleDateString()} • {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="ml-auto font-medium">
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
