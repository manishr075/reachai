import Link from "next/link"
import { Users, Mail, MailCheck, MessageSquare, ArrowUpRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { PerformanceChart } from "@/components/performance-chart"
import { stats, campaigns } from "@/lib/mock-data"

const statusChip: Record<string, string> = {
  active: "bg-success/12 text-success",
  draft: "bg-muted text-muted-foreground",
  completed: "bg-chart-3/12 text-chart-3",
}

export default function DashboardPage() {
  const nf = new Intl.NumberFormat("en-US")

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, Alex. Here&apos;s how your outbound is performing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total prospects"
          value={nf.format(stats.totalProspects)}
          icon={Users}
          delta={12.4}
        />
        <StatCard
          label="Emails generated"
          value={nf.format(stats.emailsGenerated)}
          icon={Mail}
          delta={8.1}
        />
        <StatCard
          label="Approved emails"
          value={nf.format(stats.approvedEmails)}
          icon={MailCheck}
          delta={5.7}
        />
        <StatCard
          label="Replies"
          value={nf.format(stats.replies)}
          icon={MessageSquare}
          delta={-2.3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Campaign performance</CardTitle>
            <CardDescription>
              Emails sent, opens, and replies over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent campaigns</CardTitle>
            <CardDescription>Your latest outbound efforts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {campaigns.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.prospects > 0
                      ? `${c.prospects} prospects · ${c.replies} replies`
                      : "No prospects yet"}
                  </span>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusChip[c.status]}`}
                >
                  {c.status}
                </span>
              </Link>
            ))}
            <Button
              render={<Link href="/campaigns" />}
              nativeButton={false}
              variant="ghost"
              size="sm"
              className="mt-1 justify-center"
            >
              View all campaigns
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
