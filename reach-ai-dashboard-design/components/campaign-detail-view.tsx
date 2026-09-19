"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  Building2,
  Target,
  Lightbulb,
  Sparkles,
  Pencil,
  RefreshCw,
  Check,
  Loader2,
  Mail,
  Send,
  MapPin,
} from "lucide-react"
import type { Campaign, Prospect, ProspectStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { StatusBadge } from "@/components/status-badge"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
}

const campaignStatusChip: Record<string, string> = {
  active: "bg-success/12 text-success",
  draft: "bg-muted text-muted-foreground",
  completed: "bg-chart-3/12 text-chart-3",
}

export function CampaignDetailView({ campaign }: { campaign: Campaign }) {
  const [statuses, setStatuses] = useState<Record<string, ProspectStatus>>(() =>
    Object.fromEntries(campaign.prospectList.map((p) => [p.id, p.status])),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ subject: "", body: "" })
  const [regenerating, setRegenerating] = useState(false)

  const selected = useMemo(
    () => campaign.prospectList.find((p) => p.id === selectedId) ?? null,
    [campaign.prospectList, selectedId],
  )

  const counts = useMemo(() => {
    const values = Object.values(statuses)
    return {
      total: values.length,
      approved: values.filter((s) => s === "approved" || s === "sent" || s === "replied").length,
      replied: values.filter((s) => s === "replied").length,
    }
  }, [statuses])

  function openProspect(p: Prospect) {
    setSelectedId(p.id)
    setEditing(false)
    setDraft({ subject: p.emailSubject, body: p.emailBody })
  }

  function closePanel() {
    setSelectedId(null)
    setEditing(false)
  }

  function approve() {
    if (!selected) return
    setStatuses((s) => ({ ...s, [selected.id]: "approved" }))
    toast.success("Email approved", {
      description: `${selected.name}'s outreach is queued to send.`,
    })
  }

  function regenerate() {
    if (!selected) return
    setRegenerating(true)
    toast.loading("Regenerating email...", { id: "regen" })
    setTimeout(() => {
      setRegenerating(false)
      toast.success("Email regenerated", {
        id: "regen",
        description: "A fresh variation is ready for review.",
      })
    }, 1600)
  }

  function saveEdit() {
    setEditing(false)
    toast.success("Changes saved")
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Button
          render={<Link href="/campaigns" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-muted-foreground"
        >
          <ArrowLeft data-icon="inline-start" />
          Back to campaigns
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {campaign.name}
              </h1>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                  campaignStatusChip[campaign.status],
                )}
              >
                {campaign.status}
              </span>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {campaign.audience}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat label="Prospects" value={counts.total} />
        <MiniStat label="Generated" value={campaign.generated} />
        <MiniStat label="Approved" value={counts.approved} />
        <MiniStat label="Replies" value={counts.replied} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Prospect</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Personalization angle
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.prospectList.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => openProspect(p)}
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-accent text-xs font-medium text-foreground">
                          {initials(p.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">
                          {p.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {p.company}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {p.role}
                  </TableCell>
                  <TableCell className="hidden max-w-xs lg:table-cell">
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {p.personalizationAngle}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statuses[p.id]} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openProspect(p)
                      }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && closePanel()}>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          {selected && (
            <>
              <SheetHeader className="gap-0 border-b p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="size-11">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {initials(selected.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col gap-1">
                    <SheetTitle className="text-lg leading-tight">
                      {selected.name}
                    </SheetTitle>
                    <span className="text-sm text-muted-foreground">
                      {selected.role} · {selected.company}
                    </span>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3.5" />
                        {selected.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {selected.location}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <StatusBadge status={statuses[selected.id]} />
                  </div>
                </div>
              </SheetHeader>

              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-5 p-5">
                  <InsightBlock
                    icon={Building2}
                    title="Company summary"
                    text={selected.companySummary}
                  />
                  <InsightBlock
                    icon={Target}
                    title="Detected opportunity"
                    text={selected.opportunity}
                  />
                  <InsightBlock
                    icon={Lightbulb}
                    title="Personalization angle"
                    text={selected.personalizationAngle}
                  />

                  <Separator />

                  <Tabs defaultValue="email" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="email" className="flex-1">
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="followups" className="flex-1">
                        Follow-ups
                      </TabsTrigger>
                      <TabsTrigger value="reasoning" className="flex-1">
                        AI reasoning
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="mt-4 flex flex-col gap-3">
                      {editing ? (
                        <div className="flex flex-col gap-3">
                          <Input
                            value={draft.subject}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, subject: e.target.value }))
                            }
                            aria-label="Email subject"
                          />
                          <Textarea
                            value={draft.body}
                            rows={12}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, body: e.target.value }))
                            }
                            aria-label="Email body"
                            className="resize-none font-mono text-xs leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div className="rounded-lg border bg-muted/30">
                          <div className="border-b px-4 py-2.5">
                            <span className="text-xs text-muted-foreground">
                              Subject
                            </span>
                            <p className="text-sm font-medium">
                              {draft.subject}
                            </p>
                          </div>
                          <p className="whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed">
                            {draft.body}
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="followups"
                      className="mt-4 flex flex-col gap-3"
                    >
                      {selected.followUps.map((f) => (
                        <div
                          key={f.day}
                          className="rounded-lg border bg-muted/30 p-4"
                        >
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Day {f.day}
                            </span>
                            <span className="text-sm font-medium">
                              {f.subject}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {f.body}
                          </p>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="reasoning" className="mt-4">
                      <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {selected.reasoning}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>

              <div className="flex items-center gap-2 border-t p-4">
                {editing ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditing(false)
                        setDraft({
                          subject: selected.emailSubject,
                          body: selected.emailBody,
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={saveEdit}>
                      <Check data-icon="inline-start" />
                      Save changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditing(true)}
                      aria-label="Edit email"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={regenerate}
                      disabled={regenerating}
                    >
                      {regenerating ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                      ) : (
                        <RefreshCw data-icon="inline-start" />
                      )}
                      Regenerate
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={approve}
                      disabled={
                        statuses[selected.id] === "approved" ||
                        statuses[selected.id] === "sent" ||
                        statuses[selected.id] === "replied"
                      }
                    >
                      {statuses[selected.id] === "approved" ||
                      statuses[selected.id] === "sent" ||
                      statuses[selected.id] === "replied" ? (
                        <Check data-icon="inline-start" />
                      ) : (
                        <Send data-icon="inline-start" />
                      )}
                      {statuses[selected.id] === "approved" ||
                      statuses[selected.id] === "sent" ||
                      statuses[selected.id] === "replied"
                        ? "Approved"
                        : "Approve"}
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-4">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="text-2xl font-semibold tabular-nums">
          {new Intl.NumberFormat("en-US").format(value)}
        </span>
      </CardContent>
    </Card>
  )
}

function InsightBlock({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Building2
  title: string
  text: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
        <Icon className="size-4" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
