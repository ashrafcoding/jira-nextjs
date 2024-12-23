"use client"

import { Label, Pie, PieChart, Sector, PolarAngleAxis, PolarGrid, Radar, RadarChart  } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
//   CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React from "react"
const chartData = [
  { month: "january", closed: 186,open:80, fill: "var(--color-january)" },
  { month: "february", closed: 305,open:200, fill: "var(--color-february)" },
  { month: "march", closed: 237,open:120, fill: "var(--color-march)" },
  { month: "april", closed: 173,open:190, fill: "var(--color-april)" },
  { month: "may", closed: 209,open:140, fill: "var(--color-may)" },
]

const chartConfig = {
  issues: {
    label: "Issues",
  },
  closed: {
    label: "closed",
    color: "hsl(var(--chart-1))",
  },
  open: {
    label: "open",
    color: "hsl(var(--chart-2))",
  },
  january: {
    label: "January",
    color: "hsl(var(--chart-1))",
  },
  february: {
    label: "February",
    color: "hsl(var(--chart-2))",
  },
  march: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  april: {
    label: "April",
    color: "hsl(var(--chart-4))",
  },
  may: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function PieComponent() {
  const id = "pie-interactive"
  const [activeMonth, setActiveMonth] = React.useState(chartData[0].month)

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  )
  const months = React.useMemo(() => chartData.map((item) => item.month), [])

  return (
    <Card data-chart={id} className="flex flex-col h-full">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Activity-chart</CardTitle>
          {/* <CardDescription>January - June 2024</CardDescription> */}
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="closed"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
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
                          {chartData[activeIndex].closed.toLocaleString()}
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


export function RadarComponent() {
    return (
      <Card className="h-full">
        <CardHeader className="items-center pb-1">
          <CardTitle>Status-chart</CardTitle>
          {/* <CardDescription>
            Showing total visitors for the last 6 months
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <RadarChart
              data={chartData}
              margin={{
                top: -60,
                bottom: -10,
              }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis dataKey="month" />
              <PolarGrid />
              <Radar
                dataKey="closed"
                fill="var(--color-closed)"
                fillOpacity={0.6}
              />
              <Radar dataKey="open" fill="var(--color-open)" />
              <ChartLegend className="mt-8" content={<ChartLegendContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  export default function Graph() {
    return (
        <div className="flex gap-4 justify-around">
        <div className="flex-1  max-w-xlg">
          <PieComponent/>
        </div>
        <div className="flex-1  max-w-xlg">
          <RadarComponent />
        </div>
      </div>
    )
  }
  
