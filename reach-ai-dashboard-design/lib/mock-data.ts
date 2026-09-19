export type ProspectStatus =
  | "draft"
  | "generated"
  | "approved"
  | "sent"
  | "replied"

export type FollowUp = {
  day: number
  subject: string
  body: string
}

export type Prospect = {
  id: string
  name: string
  company: string
  role: string
  email: string
  location: string
  status: ProspectStatus
  companySummary: string
  opportunity: string
  personalizationAngle: string
  emailSubject: string
  emailBody: string
  followUps: FollowUp[]
  reasoning: string
}

export type Campaign = {
  id: string
  name: string
  product: string
  audience: string
  status: "active" | "draft" | "completed"
  createdAt: string
  prospects: number
  generated: number
  approved: number
  replies: number
  prospectList: Prospect[]
}

export const stats = {
  totalProspects: 2847,
  emailsGenerated: 2412,
  approvedEmails: 1689,
  replies: 384,
}

export const campaignPerformance = [
  { month: "Jan", sent: 220, opens: 138, replies: 24 },
  { month: "Feb", sent: 310, opens: 201, replies: 41 },
  { month: "Mar", sent: 480, opens: 322, replies: 63 },
  { month: "Apr", sent: 390, opens: 250, replies: 52 },
  { month: "May", sent: 560, opens: 389, replies: 88 },
  { month: "Jun", sent: 640, opens: 452, replies: 116 },
]

export const analytics = {
  emailsSent: 1689,
  opens: 1112,
  replies: 384,
  positiveReplies: 241,
  openRate: 65.8,
  replyRate: 22.7,
}

export const funnel = [
  { stage: "Sent", value: 1689 },
  { stage: "Opened", value: 1112 },
  { stage: "Replied", value: 384 },
  { stage: "Positive", value: 241 },
]

export const replyBreakdown = [
  { label: "Positive", value: 241, fill: "var(--chart-4)" },
  { label: "Neutral", value: 98, fill: "var(--chart-3)" },
  { label: "Not interested", value: 45, fill: "var(--chart-5)" },
]

function makeFollowUps(company: string): FollowUp[] {
  return [
    {
      day: 3,
      subject: `Quick follow-up, ${company}`,
      body: `Hi again — just floating this back to the top of your inbox. Happy to share a 2-minute Loom showing how teams like ${company} cut manual prospecting time in half. Worth a look?`,
    },
    {
      day: 7,
      subject: `One idea for ${company}`,
      body: `I put together a short teardown of where ${company}'s outbound could pick up more qualified replies. No strings — want me to send it over?`,
    },
    {
      day: 12,
      subject: `Closing the loop`,
      body: `I don't want to crowd your inbox, so this is my last note. If timing is off, no worries at all — I'll check back next quarter. Either way, wishing the ${company} team a strong one.`,
    },
  ]
}

const prospects: Prospect[] = [
  {
    id: "p1",
    name: "Sarah Chen",
    company: "Northwind Analytics",
    role: "VP of Sales",
    email: "s.chen@northwind.io",
    location: "San Francisco, CA",
    status: "replied",
    companySummary:
      "Northwind Analytics is a Series B data-observability platform helping mid-market teams monitor pipeline health. ~180 employees, doubled headcount in the last 12 months, and recently expanded into the EU.",
    opportunity:
      "Rapid GTM hiring signals an SDR team scaling faster than its tooling. Manual list-building is likely bottlenecking their new reps.",
    personalizationAngle:
      "Reference their recent EU expansion and the 40 open GTM roles on their careers page as evidence of scale-driven pain.",
    emailSubject: "Scaling outbound without scaling headcount, Sarah?",
    emailBody:
      "Hi Sarah,\n\nCongrats on the EU expansion — I noticed Northwind has 40+ GTM roles open right now. That kind of growth usually means your new reps are spending more time building lists than actually selling.\n\nReachAI turns a raw prospect list into personalized, ready-to-send outreach in minutes, so ramping reps hit quota faster. Teams like yours have cut prospecting time by ~60%.\n\nWorth a quick 15 minutes next week?\n\nBest,\nAlex",
    followUps: makeFollowUps("Northwind"),
    reasoning:
      "The hiring surge and EU expansion were weighted as the strongest buying signals. The message leads with a growth compliment, ties it to a concrete pain (rep ramp time), then quantifies the outcome — matching how VPs of Sales evaluate tooling.",
  },
  {
    id: "p2",
    name: "Marcus Reid",
    company: "Lumen Freight",
    role: "Head of Revenue",
    email: "marcus@lumenfreight.com",
    location: "Chicago, IL",
    status: "approved",
    companySummary:
      "Lumen Freight is a logistics-tech company digitizing freight brokerage for regional carriers. Bootstrapped, profitable, ~90 employees, known for a lean and metrics-driven revenue org.",
    opportunity:
      "A lean, profitable team optimizing for efficiency is an ideal fit for automation that removes low-value manual work.",
    personalizationAngle:
      "Lean, bootstrapped culture — emphasize efficiency and ROI over flashy features.",
    emailSubject: "A leaner way to run outbound at Lumen",
    emailBody:
      "Hi Marcus,\n\nRunning a profitable, lean revenue org means every hour of rep time has to count. If your team is still hand-writing outreach, that's hours a week you could reclaim.\n\nReachAI drafts personalized emails and follow-up sequences from your prospect list automatically — your reps just review and approve. No bloat, measurable ROI.\n\nOpen to a short call?\n\nBest,\nAlex",
    followUps: makeFollowUps("Lumen"),
    reasoning:
      "Lumen's bootstrapped, efficiency-first profile drove a value angle focused on time reclaimed and ROI rather than feature breadth, which resonates with metrics-driven leaders.",
  },
  {
    id: "p3",
    name: "Priya Natarajan",
    company: "Cobalt Health",
    role: "Director of Growth",
    email: "priya.n@cobalthealth.co",
    location: "Boston, MA",
    status: "generated",
    companySummary:
      "Cobalt Health builds patient-engagement software for outpatient clinics. Series A, ~55 employees, recently launched a self-serve product tier and is pushing into PLG-driven growth.",
    opportunity:
      "A new self-serve tier means a flood of leads that need timely, personalized nurture — a natural fit for automated outreach.",
    personalizationAngle:
      "Tie the message to their new self-serve launch and the volume of inbound signups needing personalized follow-up.",
    emailSubject: "Personalized nurture for your new self-serve leads",
    emailBody:
      "Hi Priya,\n\nSaw Cobalt just launched a self-serve tier — exciting move. The tricky part of PLG is following up with every signup personally without burning out your team.\n\nReachAI generates tailored outreach for each new lead based on their profile and behavior, so nurture feels 1:1 even at volume.\n\nWould love to show you how it works — 15 minutes?\n\nBest,\nAlex",
    followUps: makeFollowUps("Cobalt"),
    reasoning:
      "The self-serve launch was detected as a timely trigger. The email connects a known PLG challenge (personal follow-up at scale) to the product's core value, using their launch as the hook.",
  },
  {
    id: "p4",
    name: "David Okafor",
    company: "Meridian Robotics",
    role: "Chief Revenue Officer",
    email: "d.okafor@meridianrobotics.ai",
    location: "Austin, TX",
    status: "sent",
    companySummary:
      "Meridian Robotics provides warehouse automation hardware and software. Series C, ~400 employees, enterprise-focused with long, multi-stakeholder sales cycles.",
    opportunity:
      "Enterprise sales cycles need consistent, high-quality touchpoints across many stakeholders — an area where personalized automation shines.",
    personalizationAngle:
      "Speak to complex, multi-threaded enterprise deals and the need for consistent messaging across stakeholders.",
    emailSubject: "Consistent outreach across every stakeholder",
    emailBody:
      "Hi David,\n\nEnterprise deals like Meridian's mean juggling a dozen stakeholders, each needing a slightly different message. Keeping that consistent — and personal — is brutal by hand.\n\nReachAI tailors outreach per persona while keeping your core narrative intact, so every touchpoint lands. Your reps stay focused on the conversations that matter.\n\nWorth exploring together?\n\nBest,\nAlex",
    followUps: makeFollowUps("Meridian"),
    reasoning:
      "Meridian's enterprise, multi-stakeholder motion informed a message centered on per-persona personalization and narrative consistency — the pains most acute in long, complex cycles.",
  },
  {
    id: "p5",
    name: "Elena Vasquez",
    company: "Brightpath EDU",
    role: "VP Marketing",
    email: "elena@brightpath.edu.co",
    location: "Denver, CO",
    status: "draft",
    companySummary:
      "Brightpath EDU is an edtech platform for professional certifications. Series A, ~70 employees, marketing-led growth with a heavy focus on content and email.",
    opportunity:
      "A marketing-led org already investing in email is primed to adopt tooling that lifts reply rates on outbound.",
    personalizationAngle:
      "Lead with email performance and reply-rate lift, matching their marketing-led, content-heavy DNA.",
    emailSubject: "Lifting reply rates on Brightpath's outbound",
    emailBody:
      "Hi Elena,\n\nBrightpath's content game is strong — but outbound email is where a lot of edtech teams leave replies on the table with generic sequences.\n\nReachAI writes outreach personalized to each prospect's role and context, which typically lifts reply rates 2-3x versus templates. Same effort, more pipeline.\n\nCan I share a few examples?\n\nBest,\nAlex",
    followUps: makeFollowUps("Brightpath"),
    reasoning:
      "Brightpath's marketing-led profile shaped a reply-rate-and-pipeline framing. The email respects their content strength while positioning personalization as the missing lever for outbound.",
  },
  {
    id: "p6",
    name: "Tom Fielding",
    company: "Harbor Point Capital",
    role: "Partner",
    email: "tfielding@harborpoint.vc",
    location: "New York, NY",
    status: "generated",
    companySummary:
      "Harbor Point Capital is an early-stage venture firm investing in B2B SaaS. Small team of 12, relationship-driven, high volume of founder outreach.",
    opportunity:
      "High-volume, relationship-driven founder outreach benefits from personalization at scale without losing a human touch.",
    personalizationAngle:
      "Frame around warm, personal founder outreach at scale — investors live and die by relationships.",
    emailSubject: "Warmer founder outreach, at Harbor Point's scale",
    emailBody:
      "Hi Tom,\n\nAt an early-stage firm, sourcing comes down to relationships — but personalizing every founder note by hand doesn't scale as your pipeline grows.\n\nReachAI helps you keep outreach genuinely personal at volume, pulling in context on each founder and company so every message feels 1:1.\n\nHappy to show you a quick example — worth a look?\n\nBest,\nAlex",
    followUps: makeFollowUps("Harbor Point"),
    reasoning:
      "The relationship-driven VC context steered the message toward preserving personal warmth at scale, avoiding sales-heavy language that would feel off to an investor audience.",
  },
  {
    id: "p7",
    name: "Aisha Rahman",
    company: "Verde Energy",
    role: "Head of Partnerships",
    email: "aisha@verde.energy",
    location: "Seattle, WA",
    status: "approved",
    companySummary:
      "Verde Energy is a clean-energy marketplace connecting commercial buyers with renewable providers. Series B, ~150 employees, partnership-led growth motion.",
    opportunity:
      "Partnership-led growth requires targeted, credible outreach to a defined set of high-value accounts.",
    personalizationAngle:
      "Emphasize precision targeting of a small set of high-value partner accounts over spray-and-pray volume.",
    emailSubject: "Precision outreach for Verde's partner pipeline",
    emailBody:
      "Hi Aisha,\n\nPartnership pipelines aren't about volume — they're about landing the right handful of high-value accounts with a credible, tailored message.\n\nReachAI researches each target account and drafts outreach that speaks directly to their priorities, so your partner conversations start warmer.\n\nWorth 15 minutes to explore?\n\nBest,\nAlex",
    followUps: makeFollowUps("Verde"),
    reasoning:
      "Verde's partnership motion prioritizes quality over quantity, so the message leaned into precision targeting and account research rather than throughput metrics.",
  },
  {
    id: "p8",
    name: "James Whitfield",
    company: "Atlas Manufacturing",
    role: "Sales Director",
    email: "jwhitfield@atlasmfg.com",
    location: "Detroit, MI",
    status: "replied",
    companySummary:
      "Atlas Manufacturing supplies precision components to the automotive sector. Established, ~600 employees, traditional field-sales org modernizing its GTM.",
    opportunity:
      "A traditional org modernizing GTM is actively seeking efficiency wins — a strong entry point for automation.",
    personalizationAngle:
      "Acknowledge their GTM modernization effort and position automation as a low-risk, high-leverage first step.",
    emailSubject: "A modern edge for the Atlas sales team",
    emailBody:
      "Hi James,\n\nModernizing a field-sales org is a big lift — the easiest early win is usually taking manual outreach off your reps' plates.\n\nReachAI turns your account list into personalized emails and follow-ups automatically, so your team spends time in front of customers, not in their inbox.\n\nOpen to seeing how it fits?\n\nBest,\nAlex",
    followUps: makeFollowUps("Atlas"),
    reasoning:
      "Atlas's GTM modernization initiative was treated as intent. The email frames automation as a safe, high-leverage first step, matching a traditional buyer's preference for low-risk wins.",
  },
]

export const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Q3 Enterprise Expansion",
    product: "ReachAI outbound automation platform",
    audience: "VPs of Sales and CROs at Series B-C B2B SaaS companies (100-500 employees)",
    status: "active",
    createdAt: "Jun 12, 2026",
    prospects: 842,
    generated: 812,
    approved: 604,
    replies: 148,
    prospectList: prospects,
  },
  {
    id: "c2",
    name: "PLG Mid-Market Push",
    product: "ReachAI self-serve lead nurture",
    audience: "Growth and Marketing leaders at product-led SaaS startups",
    status: "active",
    createdAt: "May 28, 2026",
    prospects: 631,
    generated: 598,
    approved: 402,
    replies: 97,
    prospectList: prospects.slice(0, 6),
  },
  {
    id: "c3",
    name: "Logistics & Supply Chain",
    product: "ReachAI for high-velocity sales teams",
    audience: "Revenue leaders at logistics and supply-chain tech companies",
    status: "completed",
    createdAt: "Apr 15, 2026",
    prospects: 514,
    generated: 514,
    approved: 388,
    replies: 79,
    prospectList: prospects.slice(2, 8),
  },
  {
    id: "c4",
    name: "Manufacturing Outbound",
    product: "ReachAI GTM modernization suite",
    audience: "Sales directors at established manufacturing firms",
    status: "draft",
    createdAt: "Jun 30, 2026",
    prospects: 0,
    generated: 0,
    approved: 0,
    replies: 0,
    prospectList: [],
  },
]

export function getCampaign(id: string) {
  return campaigns.find((c) => c.id === id)
}

export const statusLabels: Record<ProspectStatus, string> = {
  draft: "Draft",
  generated: "Generated",
  approved: "Approved",
  sent: "Sent",
  replied: "Replied",
}
