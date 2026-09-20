# ReachAI

ReachAI is a hackathon prototype for evidence-based, human-reviewed outbound sales campaigns. It turns a fictional prospect's approved local context into a personalized email and two follow-ups that a user can review, edit, and approve in the browser.

The project is a demo only. It uses fictional prospect data and simulated analytics. It does not scrape websites, integrate with LinkedIn, use real prospect data, or send email.

## Problem

Generic outbound hides its evidence and can make a generated message feel untrustworthy. Sales teams need a fast way to move from supplied prospect context to relevant draft copy while retaining a clear human checkpoint before any real-world use.

## Solution

ReachAI uses approved, local fictional context to produce a structured initial email and exactly two follow-ups. It makes the evidence, business opportunity, personalization angle, and human approval step visible in the product rather than presenting an opaque chatbot response.

## Why ReachAI is different

- The **WHY THIS MESSAGE?** evidence rail makes the visible context behind a draft legible without exposing hidden model reasoning.
- The product distinguishes generation from approval: AI proposes; a person reviews, edits or regenerates, and explicitly approves.
- The demo preserves provenance: the UI shows the Strands Agent and Amazon Bedrock path, while the local tool limits drafts to supplied fictional context.

## Product workflow

```text
Prospect → verified context → business opportunity → personalization angle
        → WHY THIS MESSAGE? → generated outreach → Day 3 / Day 7 follow-ups
        → human review → approve
```

Approval is simulated. ReachAI has no email-delivery capability.

## Architecture

```text
Browser → Next.js UI → campaign API route → Strands Agent
        → get_prospect_context (local fictional data) → Amazon Bedrock
        → structured campaign JSON → review UI
```

The campaign route validates the request, asks the agent to retrieve local company context, validates the structured response, and returns it to the campaign review screen. The UI only supports review, edit, and simulated approval; it has no sending integration.

## How AWS is used

Amazon Bedrock is the model runtime for structured campaign generation. The Next.js campaign API creates a Strands Agent backed by the configured Amazon Nova Micro inference profile in `ap-south-1`; that agent invokes the local `get_prospect_context` tool before drafting. ReachAI does not claim or use any additional AWS services.

## Requirements

- Node.js and npm
- An AWS CLI profile named `my-bedrock-profile`, authenticated through your normal AWS workflow
- Amazon Bedrock access for the configured inference profile

## Setup

Install the project dependencies:

```bash
npm install
```

The server resolves the following environment variables. Set them in your local environment as appropriate; never commit credentials or `.env.local`.

- `AWS_PROFILE`: Selects the local AWS CLI/profile configuration (for example, `my-bedrock-profile`).
- `BEDROCK_MODEL_ID`: Optional explicit model setting. It must remain the active APAC Nova Micro inference profile (`apac.amazon.nova-micro-v1:0`) unless independently verified.

The application configures Bedrock requests in `ap-south-1`. Keep this runtime region and the model identifier unchanged unless the working inference-profile setup is independently verified first.

## Local development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then choose **New campaign**. For the approved walkthrough, select **Rahul Sharma · Acme Technologies**.

For production verification, run:

```bash
npx tsc --noEmit
npm run lint
npm run build -- --webpack
```

## AI, Bedrock, and Strands

ReachAI uses the Strands Agents SDK with Amazon Bedrock. The agent's system instructions require `get_prospect_context` before campaign drafting and require JSON without Markdown fences. The local tool looks up only approved fictional records in `src/lib/mock-data.ts`; no network research occurs.

The configured model is `apac.amazon.nova-micro-v1:0`, an APAC Amazon Nova Micro inference profile. The agent is intentionally constrained to evidence supplied in the selected prospect record or returned from the local tool. The server validates the campaign response with Zod before it reaches the UI.

## Fictional-data-only demo

The approved demo record is:

- Rahul Sharma, VP Sales at Acme Technologies
- Industry: B2B SaaS
- Company description: Acme Technologies provides workflow automation software for growing businesses.
- Recent signal: The company is expanding its sales organization.

All other dashboard metrics, companies, and outreach copy are simulated prototype material—not customer results or real prospect information.

## What we learned

- Grounding a sales draft in a small, supplied context set is more useful when the user can see the relevant evidence beside the message.
- Structured output validation and a local context tool make the demo behavior easier to constrain and explain.
- The product needs to communicate that generation is assistance, not autonomous outreach; the explicit review-and-approve step is therefore central to the experience.

## AI coding tools used

Codex was used for the implementation and final polish pass represented in this repository. No other AI coding tool is claimed in this write-up.

## Known limitations

- The demo stores prospects and campaign state locally; edits and approvals are not persisted.
- There is no contact enrichment, scraping, LinkedIn integration, CRM integration, or email delivery.
- Bedrock generation requires an active, authorized local AWS session. If that session expires, the campaign route returns a safe error.
- AI output is generated for review, not autonomous delivery. A human should review every message before using it outside the demo.
