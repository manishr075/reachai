"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  Building2,
  Target,
  Lightbulb,
  Pencil,
  RefreshCw,
  Check,
  Loader2,
  Mail,
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

type Draft = {
  subject: string
  body: string
  followUps: Prospect["followUps"]
}

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
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [draft, setDraft] = useState<Draft>({ subject: "", body: "", followUps: [] })
  const [regenerating, setRegenerating] = useState(false)
  const [regenerationVersions, setRegenerationVersions] = useState<Record<string, number>>({})

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
    const existingDraft = drafts[p.id] ?? {
      subject: p.emailSubject,
      body: p.emailBody,
      followUps: p.followUps,
    }
    setSelectedId(p.id)
    setIsReviewOpen(true)
    setEditing(false)
    setDraft(existingDraft)
  }

  function handleReviewOpenChange(open: boolean) {
    setIsReviewOpen(open)
    if (!open) {
      setSelectedId(null)
      setEditing(false)
    }
  }

  function approve() {
    if (!selected) return
    setStatuses((s) => ({ ...s, [selected.id]: "approved" }))
    toast.success("Draft approved", {
      description: "Approval is recorded for this demo. No email is sent.",
    })
  }

  async function regenerate() {
    if (!selected || regenerating) return
    const nextRegenerationVersion = (regenerationVersions[selected.id] ?? 0) + 1
    setRegenerating(true)
    toast.loading("Regenerating email...", { id: "regen" })
    try {
      const response = await fetch("/api/campaigns/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect: selected,
          productDescription: campaign.product,
          targetCustomer: campaign.audience,
          regenerationVersion: nextRegenerationVersion,
          previousDraft: {
            subject: draft.subject,
            emailBody: draft.body,
            followups: draft.followUps,
          },
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to regenerate outreach.")
      }
      const nextDraft: Draft = {
        subject: data.campaign.subject,
        body: data.campaign.emailBody,
        followUps: data.campaign.followups,
      }
      setDraft(nextDraft)
      setDrafts((current) => ({ ...current, [selected.id]: nextDraft }))
      setRegenerationVersions((current) => ({ ...current, [selected.id]: nextRegenerationVersion }))
      toast.success("Email regenerated", {
        id: "regen",
        description: "A fresh variation is ready for review.",
      })
    } catch (cause) {
      toast.error("Could not regenerate email", {
        id: "regen",
        description: cause instanceof Error ? cause.message : "Try again.",
      })
    } finally {
      setRegenerating(false)
    }
  }

  function saveEdit() {
    if (selected) {
      setDrafts((current) => ({ ...current, [selected.id]: draft }))
    }
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

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-primary/15 bg-primary/[0.045] px-4 py-3 text-xs text-muted-foreground backdrop-blur-sm">
        <span className="font-semibold text-foreground">Human review workflow</span>
        <span>AI proposes</span>
        <span aria-hidden="true">→</span>
        <span>you review and edit</span>
        <span aria-hidden="true">→</span>
        <span>you approve</span>
        <span className="text-primary">No email is sent from this demo.</span>
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

      <Sheet open={isReviewOpen} onOpenChange={handleReviewOpenChange}>
        <SheetContent className="flex w-full min-w-0 flex-col gap-0 border-border/80 bg-popover/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-xl">
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
                    <span className="mt-1 text-xs font-medium text-primary">
                      Reviewable demo draft · no automated sending
                    </span>
                  </div>
                  <div className="ml-auto">
                    <StatusBadge status={statuses[selected.id]} />
                  </div>
                </div>
              </SheetHeader>

              <ScrollArea className="min-h-0 flex-1">
                <div className="flex flex-col gap-5 p-5">
                  <section className="flex flex-col gap-4" aria-label="Prospect intelligence">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-primary">
                        PROSPECT INTELLIGENCE
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Supplied campaign context, organized for a quick review.
                      </p>
                    </div>
                    <div className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
                      <Fact label="Role" value={selected.role} />
                      <Fact label="Company" value={selected.company} />
                      {selected.industry && <Fact label="Industry" value={selected.industry} />}
                      {selected.recentSignal && <Fact label="Recent signal" value={selected.recentSignal} />}
                    </div>
                    <InsightBlock
                      icon={Building2}
                      title="Company context"
                      text={selected.companyDescription ?? selected.companySummary}
                    />
                    <InsightBlock
                      icon={Target}
                      title="Business opportunity"
                      text={selected.opportunity}
                    />
                    <InsightBlock
                      icon={Lightbulb}
                      title="Personalization angle"
                      text={selected.personalizationAngle}
                    />
                  </section>

                  <Separator />

                  <Tabs defaultValue="email" className="w-full min-w-0">
                    <TabsList className="w-full">
                      <TabsTrigger value="email" className="flex-1">
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="followups" className="flex-1">
                        Follow-ups
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="mt-4 flex w-full min-w-0 flex-col gap-3">
                      <WhyThisMessage prospect={selected} />
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
                        <div className="w-full min-w-0 rounded-lg border bg-background shadow-sm">
                          <div className="border-b px-4 py-2.5">
                            <span className="text-xs text-muted-foreground">
                              Subject
                            </span>
                            <p className="break-words text-sm font-medium">
                              {draft.subject}
                            </p>
                          </div>
                          <p className="whitespace-pre-wrap break-words px-4 py-3 text-sm leading-relaxed">
                            {draft.body}
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="followups"
                      className="mt-4"
                    >
                      <SequenceTimeline
                        subject={draft.subject}
                        followUps={draft.followUps}
                      />
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
                          subject: drafts[selected.id]?.subject ?? selected.emailSubject,
                          body: drafts[selected.id]?.body ?? selected.emailBody,
                          followUps: drafts[selected.id]?.followUps ?? selected.followUps,
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
                      <Check data-icon="inline-start" />
                      {statuses[selected.id] === "approved" ||
                      statuses[selected.id] === "sent" ||
                      statuses[selected.id] === "replied"
                        ? "Approved"
                        : "Approve draft"}
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-popover px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium leading-snug text-foreground">{value}</p>
    </div>
  )
}

function evidenceReasons(prospect: Prospect) {
  return [
    prospect.recentSignal,
    `Prospect role: ${prospect.role}.`,
    prospect.industry && `Industry: ${prospect.industry}.`,
    prospect.companyDescription ?? prospect.companySummary,
  ].filter((reason): reason is string => Boolean(reason)).slice(0, 4)
}

function WhyThisMessage({ prospect }: { prospect: Prospect }) {
  const reasons = evidenceReasons(prospect)

  return (
    <section className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.055] p-4 shadow-sm backdrop-blur-md">
      <div className="absolute inset-y-0 left-0 w-1 bg-primary/70" aria-hidden="true" />
      <div className="pl-1">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary">
          WHY THIS MESSAGE?
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Each point below is visible campaign context, not hidden model reasoning.
        </p>
        <ol className="mt-3 flex flex-col gap-2.5">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-medium tracking-wide text-primary">
          <span>CONTEXT</span>
          <span aria-hidden="true">→</span>
          <span>ANGLE</span>
          <span aria-hidden="true">→</span>
          <span>MESSAGE</span>
        </div>
      </div>
    </section>
  )
}

function SequenceTimeline({
  subject,
  followUps,
}: {
  subject: string
  followUps: Prospect["followUps"]
}) {
  const steps = [
    {
      label: "Today",
      title: "Initial outreach",
      subject,
      body: "Draft ready for human review.",
    },
    ...followUps.map((followUp) => ({
      label: `Day ${followUp.day}`,
      title: "Follow-up",
      subject: followUp.subject,
      body: followUp.body,
    })),
  ]

  return (
    <ol className="flex flex-col" aria-label="Follow-up sequence">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
          {index < steps.length - 1 && (
            <span className="absolute left-[11px] top-6 h-[calc(100%-8px)] border-l border-dashed border-primary/35" aria-hidden="true" />
          )}
          <span className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background text-[10px] font-semibold text-primary">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1 rounded-lg border bg-background p-3.5 shadow-sm">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-xs font-semibold text-primary">{step.label}</span>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            <p className="mt-1 break-words text-sm font-medium leading-snug">{step.subject}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
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
