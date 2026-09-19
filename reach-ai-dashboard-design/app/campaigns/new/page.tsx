"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Upload,
  FileText,
  Sparkles,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"

export default function NewCampaignPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [product, setProduct] = useState("")
  const [audience, setAudience] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const [generating, setGenerating] = useState(false)

  const canSubmit = name.trim() && product.trim() && audience.trim() && fileName

  function handleFile(file: File | undefined) {
    if (!file) return
    setFileName(file.name)
    setRows(Math.floor(Math.random() * 400) + 120)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || generating) return
    setGenerating(true)
    toast.loading("Generating personalized campaign...", { id: "gen" })
    setTimeout(() => {
      toast.success("Campaign generated", {
        id: "gen",
        description: `${rows} personalized emails drafted and ready for review.`,
      })
      router.push("/campaigns/c1")
    }, 2200)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
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
        <h1 className="text-2xl font-semibold tracking-tight">New campaign</h1>
        <p className="text-sm text-muted-foreground">
          Describe your offer and upload your prospect list. ReachAI will
          research each prospect and draft personalized outreach.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Campaign details</CardTitle>
            <CardDescription>
              The more context you give, the sharper the personalization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Campaign name</FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g. Q3 Enterprise Expansion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="product">
                  Product / service description
                </FieldLabel>
                <Textarea
                  id="product"
                  rows={4}
                  placeholder="Describe what you're selling, the core value proposition, and the problem it solves."
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
                <FieldDescription>
                  Used to frame the value proposition in every email.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="audience">
                  Target customer description
                </FieldLabel>
                <Textarea
                  id="audience"
                  rows={3}
                  placeholder="e.g. VPs of Sales at Series B-C B2B SaaS companies with 100-500 employees."
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
                <FieldDescription>
                  Helps ReachAI detect the right business opportunity per
                  prospect.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="csv">Prospect list (CSV)</FieldLabel>
                <input
                  ref={inputRef}
                  id="csv"
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {!fileName ? (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragging(false)
                      handleFile(e.dataTransfer.files?.[0])
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center transition-colors",
                      dragging
                        ? "border-primary bg-accent/50"
                        : "border-input hover:border-primary/50 hover:bg-accent/30",
                    )}
                  >
                    <div className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                      <Upload className="size-5" />
                    </div>
                    <span className="text-sm font-medium">
                      Drop your CSV here, or click to browse
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Include name, company, role, and email columns
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border bg-card p-3.5">
                    <div className="flex size-10 items-center justify-center rounded-md bg-accent text-primary">
                      <FileText className="size-5" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {fileName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rows} prospects detected
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      aria-label="Remove file"
                      onClick={() => {
                        setFileName(null)
                        setRows(null)
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-end">
          <Button
            render={<Link href="/campaigns" />}
            nativeButton={false}
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit || generating}
            className="w-full sm:w-auto"
          >
            {generating ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Sparkles data-icon="inline-start" />
            )}
            {generating ? "Generating..." : "Generate campaign"}
          </Button>
        </div>
      </form>
    </div>
  )
}
