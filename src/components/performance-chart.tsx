"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { campaignPerformance } from "@/lib/mock-data"

const config = {
  sent: { label: "Sent", color: "var(--chart-1)" },
  opens: { label: "Opens", color: "var(--chart-2)" },
  replies: { label: "Replies", color: "var(--chart-4)" },
} satisfies ChartConfig

export function PerformanceChart() {
  return (
    <ChartContainer config={config} className="h-[280px] w-full">
      <AreaChart data={campaignPerformance} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          {Object.keys(config).map((key) => (
            <linearGradient
              key={key}
              id={`fill-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.3} />
              <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={32}
          tickMargin={4}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="sent"
          type="monotone"
          stroke="var(--color-sent)"
          fill="url(#fill-sent)"
          strokeWidth={2}
        />
        <Area
          dataKey="opens"
          type="monotone"
          stroke="var(--color-opens)"
          fill="url(#fill-opens)"
          strokeWidth={2}
        />
        <Area
          dataKey="replies"
          type="monotone"
          stroke="var(--color-replies)"
          fill="url(#fill-replies)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
