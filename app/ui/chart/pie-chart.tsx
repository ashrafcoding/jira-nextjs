"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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
import { Stats } from "@/lib/definitions"

export function Donut({ stats, name }: { stats: Stats, name: string }) {
    const data = Object.keys(stats).map((key) => ({
        name: key,
        value: Number(stats[key as keyof typeof stats]),
      }))
      const chartData =  data.map((item) => {
        if(item.name === "total")return
        return {
        status: item.name,
        statistic: item.value,
        fill: `var(--color-${item.name})`,
      }})
      
    

    const chartconf = data.reduce((acc, item) => {
        return {
          ...acc,
          [item.name]: {
            label: item.name,
            color: `hsl(var(--chart-${data.indexOf(item) + 1}))`,
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
    
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Issue Distribution by {name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="statistic"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {stats.total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Issues
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
