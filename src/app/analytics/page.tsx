import { Send, MailOpen, MessageSquare, ThumbsUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import {
  EngagementTrendChart,
  FunnelChart,
  ReplyBreakdownChart,
} from "@/components/analytics-charts"
import { analytics } from "@/lib/mock-data"

export default function AnalyticsPage() {
  const nf = new Intl.NumberFormat("en-US")

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Demo analytics · simulated data. These are not customer or production results.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Emails sent"
          value={nf.format(analytics.emailsSent)}
          icon={Send}
          delta={14.2}
        />
        <StatCard
          label="Open rate"
          value={`${analytics.openRate}%`}
          icon={MailOpen}
          delta={3.4}
        />
        <StatCard
          label="Reply rate"
          value={`${analytics.replyRate}%`}
          icon={MessageSquare}
          delta={6.1}
        />
        <StatCard
          label="Positive replies"
          value={nf.format(analytics.positiveReplies)}
          icon={ThumbsUp}
          delta={9.8}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement trend</CardTitle>
            <CardDescription>Opens and replies over time</CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reply sentiment</CardTitle>
            <CardDescription>Breakdown of prospect responses</CardDescription>
          </CardHeader>
          <CardContent>
            <ReplyBreakdownChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion funnel</CardTitle>
          <CardDescription>
            From emails sent to positive responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FunnelChart />
        </CardContent>
      </Card>
    </div>
  )
}
