import Link from "next/link"
import { Plus, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { campaigns } from "@/lib/mock-data"

const statusChip: Record<string, string> = {
  active: "bg-success/12 text-success",
  draft: "bg-muted text-muted-foreground",
  completed: "bg-chart-3/12 text-chart-3",
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export default function CampaignsPage() {
  const nf = new Intl.NumberFormat("en-US")

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all your outbound campaigns.
          </p>
        </div>
        <Button render={<Link href="/campaigns/new" />} nativeButton={false}>
          <Plus data-icon="inline-start" />
          New campaign
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {campaigns.map((c) => (
          <Link key={c.id} href={`/campaigns/${c.id}`} className="group">
            <Card className="transition-colors group-hover:border-primary/40">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <span className="truncate font-medium">{c.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusChip[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <span className="truncate text-sm text-muted-foreground">
                    {c.audience}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Created {c.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-6">
                    <Metric label="Prospects" value={nf.format(c.prospects)} />
                    <Metric label="Generated" value={nf.format(c.generated)} />
                    <Metric label="Approved" value={nf.format(c.approved)} />
                    <Metric label="Replies" value={nf.format(c.replies)} />
                  </div>
                  <ChevronRight className="hidden size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
