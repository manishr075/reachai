import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  label: string
  value: string
  icon: LucideIcon
  delta?: number
  deltaLabel?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel = "vs last month",
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent/60 text-primary">
            <Icon className="size-4.5" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
          {delta !== undefined && (
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
                  positive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {positive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {positive ? "+" : ""}
                {delta}%
              </span>
              <span className="text-muted-foreground">{deltaLabel}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
