"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { campaignPerformance, funnel, replyBreakdown } from "@/lib/mock-data"

const trendConfig = {
  opens: { label: "Opens", color: "var(--chart-2)" },
  replies: { label: "Replies", color: "var(--chart-4)" },
} satisfies ChartConfig

export function EngagementTrendChart() {
  return (
    <ChartContainer config={trendConfig} className="h-[260px] w-full">
      <LineChart data={campaignPerformance} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} width={32} tickMargin={4} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="opens"
          type="monotone"
          stroke="var(--color-opens)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="replies"
          type="monotone"
          stroke="var(--color-replies)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

const funnelConfig = {
  value: { label: "Prospects", color: "var(--chart-1)" },
} satisfies ChartConfig

export function FunnelChart() {
  return (
    <ChartContainer config={funnelConfig} className="h-[260px] w-full">
      <BarChart
        data={funnel}
        layout="vertical"
        margin={{ left: 8, right: 16 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={6} barSize={28} />
      </BarChart>
    </ChartContainer>
  )
}

const replyConfig = {
  value: { label: "Replies" },
  Positive: { label: "Positive", color: "var(--chart-4)" },
  Neutral: { label: "Neutral", color: "var(--chart-3)" },
  "Not interested": { label: "Not interested", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ReplyBreakdownChart() {
  return (
    <ChartContainer
      config={replyConfig}
      className="mx-auto aspect-square h-[260px]"
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={replyBreakdown}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={95}
          strokeWidth={3}
        >
          {replyBreakdown.map((entry) => (
            <Cell key={entry.label} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="label" />}
          className="flex-wrap gap-2"
        />
      </PieChart>
    </ChartContainer>
  )
}
