"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { prospects } from "@/lib/mock-data";
import type { CampaignGenerationResult } from "@/lib/campaign-schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const stages = ["Analyzing prospect", "Retrieving company context", "Finding personalization angle", "Writing outreach", "Creating follow-ups"];

export default function NewCampaignPage() {
  const [prospectId, setProspectId] = useState(prospects[0].id);
  const [product, setProduct] = useState("ReachAI turns a prospect list into evidence-based, personalized outbound emails and follow-ups that a sales team reviews before sending.");
  const [audience, setAudience] = useState("Sales and growth leaders at B2B companies that need relevant outbound without manual prospect research.");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<CampaignGenerationResult | null>(null);
  const [toolUsed, setToolUsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [approved, setApproved] = useState(false);
  const [regenerationVersion, setRegenerationVersion] = useState(0);

  async function generate(alternative = false) {
    const prospect = prospects.find((item) => item.id === prospectId);
    if (!prospect || loading) return;
    const previousDraft = alternative && result
      ? { subject: result.subject, emailBody: result.emailBody, followups: result.followups }
      : undefined;
    const nextRegenerationVersion = previousDraft ? regenerationVersion + 1 : 0;
    setLoading(true); if (!previousDraft) setResult(null); setToolUsed(false); setError(null); setStage(0); setEditing(false); setApproved(false);
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), 950);
    try {
      const response = await fetch("/api/campaigns/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prospect, productDescription: product, targetCustomer: audience, ...(previousDraft ? { previousDraft, regenerationVersion: nextRegenerationVersion } : {}) }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error ?? "Unable to generate outreach.");
      setResult(data.campaign);
      setToolUsed(data.toolUsed === true);
      setRegenerationVersion(nextRegenerationVersion);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to generate outreach. Try again.");
    } finally { window.clearInterval(timer); setLoading(false); }
  }

  const selected = prospects.find((item) => item.id === prospectId)!;
  return <div className="mx-auto flex max-w-4xl flex-col gap-6">
    <div><Link href="/campaigns" className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><ArrowLeft className="size-4" /> Back to campaigns</Link><h1 className="mt-2 text-2xl font-semibold tracking-tight">Create campaign</h1><p className="mt-1 text-sm text-muted-foreground">Generate a real, reviewable outreach sequence from fictional demo prospects.</p><div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-xl border border-primary/15 bg-primary/[0.045] px-3.5 py-3 text-xs backdrop-blur-sm"><span className="font-semibold tracking-wide text-foreground">DRAFTING PATH</span><span className="text-muted-foreground">ReachAI UI</span><ArrowRight className="size-3.5 text-primary" aria-hidden="true" /><span className="text-muted-foreground">Strands Agent</span><ArrowRight className="size-3.5 text-primary" aria-hidden="true" /><span className="font-medium text-foreground">Amazon Bedrock</span><ArrowRight className="size-3.5 text-primary" aria-hidden="true" /><span className="text-muted-foreground">Structured campaign</span></div></div>
    <Card><CardHeader><CardTitle>Campaign inputs</CardTitle></CardHeader><CardContent className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-1.5 text-sm font-medium">Demo prospect<Select value={prospectId} onValueChange={(value) => { if (!value) return; setProspectId(value); if (value !== prospectId) { setResult(null); setToolUsed(false); setError(null); setEditing(false); setApproved(false); setRegenerationVersion(0); } }} disabled={loading}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{prospects.map((item) => <SelectItem key={item.id} value={item.id}>{item.name} · {item.company}</SelectItem>)}</SelectContent></Select></label><div className="rounded-lg border bg-background p-3 text-sm shadow-sm"><p className="text-xs font-semibold tracking-[0.12em] text-primary">PROSPECT INTELLIGENCE</p><p className="mt-1.5 font-medium">{selected.role} · {selected.company}</p>{selected.industry && <p className="mt-1 text-xs text-muted-foreground">Industry: {selected.industry}</p>}{selected.recentSignal && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Recent signal: {selected.recentSignal}</p>}<p className="mt-2 text-xs font-medium text-primary">Uses supplied fictional demo context only.</p></div></div>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Product / service description<Textarea rows={4} value={product} onChange={(event) => setProduct(event.target.value)} disabled={loading} className="resize-none" /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Target customer description<Textarea rows={3} value={audience} onChange={(event) => setAudience(event.target.value)} disabled={loading} className="resize-none" /></label>
      <div className="flex justify-end"><Button onClick={() => generate()} disabled={loading || product.trim().length < 10 || audience.trim().length < 10}>{loading ? <Loader2 className="animate-spin" /> : <Sparkles />} {loading ? stages[stage] : "Generate outreach"}</Button></div>
    </CardContent></Card>
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
    {result && <div className="flex flex-col gap-5">
      <Card><CardHeader><CardTitle>Personalized outreach ready</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">{toolUsed && <p className="w-fit rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Verified company context used</p>}<Insight title="Company summary" text={result.companySummary} /><Insight title="Business opportunity" text={result.painPoint} /><Insight title="Personalization angle" text={result.personalizationAngle} /></CardContent></Card>
      <WhyThisMessage reasons={result.whyThisMessage} />
      <Card><CardHeader><CardTitle>Email · Day 0</CardTitle></CardHeader><CardContent><div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-primary/15 bg-primary/[0.045] px-3 py-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">AI proposes</span><span aria-hidden="true">→</span><span>you review and edit</span><span aria-hidden="true">→</span><span className="font-medium text-primary">you approve</span><span>· no email is sent</span></div>{editing ? <div className="flex flex-col gap-3"><Textarea aria-label="Email subject" rows={1} value={result.subject} onChange={(event) => setResult({ ...result, subject: event.target.value })} /><Textarea aria-label="Email body" rows={11} value={result.emailBody} onChange={(event) => setResult({ ...result, emailBody: event.target.value })} /></div> : <div className="rounded-lg border bg-background shadow-sm"><div className="border-b px-4 py-2.5"><p className="text-xs text-muted-foreground">Subject</p><p className="mt-0.5 break-words text-sm font-medium">{result.subject}</p></div><p className="whitespace-pre-wrap break-words px-4 py-3 text-sm leading-relaxed">{result.emailBody}</p></div>}<div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" onClick={() => setEditing((value) => !value)}>{editing ? "Save edits" : "Edit"}</Button><Button variant="outline" onClick={() => generate(true)} disabled={loading}><Sparkles />Regenerate</Button><Button onClick={() => setApproved(true)} disabled={approved}>{approved ? <Check /> : null}{approved ? "Approved" : "Approve draft"}</Button></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Follow-up sequence</CardTitle></CardHeader><CardContent><SequenceTimeline subject={result.subject} followUps={result.followups} /></CardContent></Card>
    </div>}
  </div>;
}

function Insight({ title, text }: { title: string; text: string }) { return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p><p className="mt-1 text-sm leading-relaxed">{text}</p></div>; }

function WhyThisMessage({ reasons }: { reasons: string[] }) { return <section className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.055] p-5 shadow-sm backdrop-blur-md"><div className="absolute inset-y-0 left-0 w-1 bg-primary/70" aria-hidden="true" /><div className="pl-1"><p className="text-xs font-semibold tracking-[0.14em] text-primary">WHY THIS MESSAGE?</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Concise, evidence-based reasons supplied with the campaign draft.</p><ol className="mt-4 grid gap-3 sm:grid-cols-2">{reasons.map((reason) => <li key={reason} className="flex gap-2 text-sm leading-relaxed text-foreground/85"><span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-2.5" strokeWidth={3} /></span><span>{reason}</span></li>)}</ol><div className="mt-4 flex items-center gap-2 text-[11px] font-medium tracking-wide text-primary"><span>CONTEXT</span><span aria-hidden="true">→</span><span>ANGLE</span><span aria-hidden="true">→</span><span>MESSAGE</span></div></div></section>; }

function SequenceTimeline({ subject, followUps }: { subject: string; followUps: CampaignGenerationResult["followups"] }) { const steps = [{ label: "Today", title: "Initial outreach", subject, body: "Draft ready for human review." }, ...followUps.map((followUp) => ({ label: `Day ${followUp.day}`, title: "Follow-up", subject: followUp.subject, body: followUp.body }))]; return <ol className="flex flex-col" aria-label="Follow-up sequence">{steps.map((step, index) => <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">{index < steps.length - 1 && <span className="absolute left-[11px] top-6 h-[calc(100%-8px)] border-l border-dashed border-primary/35" aria-hidden="true" />}<span className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-card text-[10px] font-semibold text-primary">{index + 1}</span><div className="min-w-0 flex-1 rounded-lg border bg-background p-3.5 shadow-sm"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-xs font-semibold text-primary">{step.label}</span><span className="text-sm font-medium">{step.title}</span></div><p className="mt-1 break-words text-sm font-medium leading-snug">{step.subject}</p><p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p></div></li>)}</ol>; }
