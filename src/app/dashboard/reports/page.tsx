import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesChart } from "@/components/sales-chart"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Activity } from "lucide-react"

export default async function ReportsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Fetch Sales (All time for now, or last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const { data: sales } = await supabase
        .from('sales')
        .select('created_at, total_price, quantity, items(name)')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

    // 2. Aggregate Data for Charts (Daily Revenue)
    // Map: Date (M/D) -> Total Amount
    const salesMap = new Map<string, number>()

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(today.getDate() - i)
        const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        salesMap.set(key, 0)
    }

    sales?.forEach(sale => {
        const date = new Date(sale.created_at)
        // Only aggregate if within last 7 days chart window for the main chart
        if (date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            const current = salesMap.get(key) || 0
            salesMap.set(key, current + sale.total_price)
        }
    })

    const chartData = Array.from(salesMap.entries()).map(([date, amount]) => ({
        date,
        amount
    }))


    // 3. Calculate Key Metrics
    const totalRevenue = sales?.reduce((acc, curr) => acc + curr.total_price, 0) || 0
    const totalItemsSold = sales?.reduce((acc, curr) => acc + curr.quantity, 0) || 0
    const averageOrderValue = totalItemsSold > 0 ? totalRevenue / (sales?.length || 1) : 0 // Approx per txn

    // Top Selling Items
    const itemSales = new Map<string, number>()
    sales?.forEach(sale => {
        // @ts-ignore
        const itemName = sale.items?.name || 'Unknown'
        const current = itemSales.get(itemName) || 0
        itemSales.set(itemName, current + sale.quantity)
    })

    // Convert to array and sort
    const topItems = Array.from(itemSales.entries())
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)


    return (
        <div className="space-y-6 pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
                <p className="text-muted-foreground">Performance summary for the last 30 days.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItemsSold}</div>
                        <p className="text-xs text-muted-foreground">
                            +180 since last hour
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{Math.round(averageOrderValue).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart */}
            <SalesChart data={chartData} />

            {/* Top Products & Recent Sales Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>
                            Your most popular items this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No sales data yet.</p>
                            ) : (
                                topItems.map((item, index) => (
                                    <div key={item.name} className="flex items-center">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs mr-4">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.name}</p>
                                            <div className="w-full bg-secondary/30 h-2 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="bg-primary h-full rounded-full"
                                                    style={{ width: `${(item.quantity / topItems[0].quantity) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-bold text-sm ml-4">{item.quantity} sold</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                            Latest transactions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sales?.slice(0, 5).reverse().map((sale: any, i: number) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-sm truncate max-w-[150px]">{sale.items?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(sale.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">₦{sale.total_price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {(!sales || sales.length === 0) && (
                                <p className="text-sm text-muted-foreground">No recent sales.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
