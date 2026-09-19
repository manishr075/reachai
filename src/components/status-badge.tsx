import { cn } from "@/lib/utils"
import type { ProspectStatus } from "@/lib/mock-data"
import { statusLabels } from "@/lib/mock-data"

const styles: Record<ProspectStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  generated: "bg-chart-2/12 text-chart-2",
  approved: "bg-primary/10 text-primary",
  sent: "bg-chart-3/12 text-chart-3",
  replied: "bg-success/12 text-success",
}

export function StatusBadge({ status }: { status: ProspectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  )
}
