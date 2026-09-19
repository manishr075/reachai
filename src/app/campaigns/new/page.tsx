"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [approved, setApproved] = useState(false);

  async function generate() {
    const prospect = prospects.find((item) => item.id === prospectId);
    if (!prospect || loading) return;
    setLoading(true); setResult(null); setError(null); setStage(0); setEditing(false); setApproved(false);
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), 950);
    try {
      const response = await fetch("/api/campaigns/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prospect, productDescription: product, targetCustomer: audience }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error ?? "Unable to generate outreach.");
      setResult(data.campaign);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to generate outreach. Try again.");
    } finally { window.clearInterval(timer); setLoading(false); }
  }

  const selected = prospects.find((item) => item.id === prospectId)!;
  return <div className="mx-auto flex max-w-4xl flex-col gap-6">
    <div><Link href="/campaigns" className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><ArrowLeft className="size-4" /> Back to campaigns</Link><h1 className="mt-2 text-2xl font-semibold tracking-tight">Create campaign</h1><p className="mt-1 text-sm text-muted-foreground">Generate a real, reviewable outreach sequence from our fictional demo prospects.</p></div>
    <Card><CardHeader><CardTitle>Campaign inputs</CardTitle></CardHeader><CardContent className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-1.5 text-sm font-medium">Demo prospect<Select value={prospectId} onValueChange={(value) => value && setProspectId(value)} disabled={loading}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{prospects.map((item) => <SelectItem key={item.id} value={item.id}>{item.name} · {item.company}</SelectItem>)}</SelectContent></Select></label><div className="rounded-lg border bg-muted/30 p-3 text-sm"><p className="font-medium">{selected.role} at {selected.company}</p><p className="mt-1 text-xs text-muted-foreground">Uses verified fictional demo context only.</p></div></div>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Product / service description<Textarea rows={4} value={product} onChange={(event) => setProduct(event.target.value)} disabled={loading} className="resize-none" /></label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Target customer description<Textarea rows={3} value={audience} onChange={(event) => setAudience(event.target.value)} disabled={loading} className="resize-none" /></label>
      <div className="flex justify-end"><Button onClick={generate} disabled={loading || product.trim().length < 10 || audience.trim().length < 10}>{loading ? <Loader2 className="animate-spin" /> : <Sparkles />} {loading ? stages[stage] : "Generate outreach"}</Button></div>
    </CardContent></Card>
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
    {result && <div className="flex flex-col gap-5">
      <Card><CardHeader><CardTitle>Personalized outreach ready</CardTitle></CardHeader><CardContent className="flex flex-col gap-4"><Insight title="Company summary" text={result.companySummary} /><Insight title="Business opportunity" text={result.painPoint} /><Insight title="Personalization angle" text={result.personalizationAngle} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Email · Day 0</CardTitle></CardHeader><CardContent>{editing ? <div className="flex flex-col gap-3"><Textarea aria-label="Email subject" rows={1} value={result.subject} onChange={(event) => setResult({ ...result, subject: event.target.value })} /><Textarea aria-label="Email body" rows={11} value={result.emailBody} onChange={(event) => setResult({ ...result, emailBody: event.target.value })} /></div> : <><p className="text-sm font-medium">Subject: {result.subject}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{result.emailBody}</p></>}<div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" onClick={() => setEditing((value) => !value)}>{editing ? "Save edits" : "Edit"}</Button><Button variant="outline" onClick={generate} disabled={loading}><Sparkles />Regenerate</Button><Button onClick={() => setApproved(true)} disabled={approved}>{approved ? <Check /> : null}{approved ? "Approved" : "Approve"}</Button></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Why this message?</CardTitle></CardHeader><CardContent><ul className="flex flex-col gap-2">{result.whyThisMessage.map((reason) => <li key={reason} className="flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{reason}</li>)}</ul></CardContent></Card>
      <Card><CardHeader><CardTitle>Follow-up sequence</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{result.followups.map((followup) => <div key={followup.day} className="rounded-lg border bg-muted/30 p-4"><p className="text-xs font-medium text-primary">Day {followup.day}</p><p className="mt-1 text-sm font-medium">{followup.subject}</p><p className="mt-2 text-sm text-muted-foreground">{followup.body}</p></div>)}</CardContent></Card>
    </div>}
  </div>;
}

function Insight({ title, text }: { title: string; text: string }) { return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p><p className="mt-1 text-sm leading-relaxed">{text}</p></div>; }
