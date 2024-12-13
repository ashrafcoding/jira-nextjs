"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function BarComponent({workload}: {workload: { [key: string]: number }}) {
  const data = Object.keys(workload).map((key) => ({
    name: key.split(" ")[0],
    value: Number(workload[key as keyof typeof workload]),
  }))
  const chartData =  data.map((item) => {
    if(item.name === "total")return
    return {
    name: item.name,
    statistic: item.value,
    fill: `var(--color-${item.name})`,
  }})
 
  
  const chartconf = data.reduce((acc, item) => {
    return {
      ...acc,
      [item.name]: {
        label: item.name,
        color: `hsl(var(--chart-${ data.indexOf(item) > 4 ? data.indexOf(item)-4 : data.indexOf(item) + 1}))`,
      },
    }
  }, {} as ChartConfig)
const chartConfig = {
    statistic: {
        label: "statistic",
    },
    ...chartconf,
} satisfies ChartConfig
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="statistic" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
