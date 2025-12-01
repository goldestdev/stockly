"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesChartProps {
  data: {
    date: string
    amount: number
  }[]
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[200px] w-full">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No sales recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₦${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Revenue
                              </span>
                              <span className="font-bold text-muted-foreground">
                                ₦{payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
