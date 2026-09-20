import { NextResponse } from "next/server";
import { campaignGenerationRequestSchema, campaignGenerationResultSchema } from "@/lib/campaign-schemas";
import { createReachAIAgent } from "@/lib/reachai-agent";

function extractJson(value: string) {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = (fenced ?? value).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("No JSON response");
  return JSON.parse(candidate.slice(start, end + 1));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function firstParagraph(value: string) {
  return value.split(/\n\s*\n/).map((part) => part.trim()).find(Boolean) ?? "";
}

function ctaParagraph(value: string) {
  const paragraphs = value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const lastParagraph = paragraphs.at(-1) ?? "";
  return /^(best|best regards|kind regards|regards|thanks|thank you|sincerely|cheers)[,!]?\s*(\n|$)/i.test(lastParagraph)
    ? paragraphs.at(-2) ?? lastParagraph
    : lastParagraph;
}

function isMeaningfullyDifferent(
  previousDraft: { subject: string; emailBody: string; followups: Array<{ subject: string; body: string }> },
  campaign: { subject: string; emailBody: string; followups: Array<{ subject: string; body: string }> },
) {
  const changedSubject = normalize(previousDraft.subject) !== normalize(campaign.subject);
  const changedOpening = normalize(firstParagraph(previousDraft.emailBody)) !== normalize(firstParagraph(campaign.emailBody));
  const changedCta = normalize(ctaParagraph(previousDraft.emailBody)) !== normalize(ctaParagraph(campaign.emailBody));
  const changedFollowUps = previousDraft.followups.every((followUp, index) => {
    const alternative = campaign.followups[index];
    return normalize(followUp.subject) !== normalize(alternative.subject)
      && normalize(followUp.body) !== normalize(alternative.body);
  });

  return changedSubject
    && changedOpening
    && changedCta
    && changedFollowUps;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = campaignGenerationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Provide a valid prospect, product description, and target customer." }, { status: 400 });
    }

    const { prospect, productDescription, targetCustomer, regenerationVersion, previousDraft } = parsed.data;
    const alternativeInstruction = regenerationVersion && previousDraft
      ? `\n\nThis is regeneration version ${regenerationVersion}. Create a substantively different alternative to the previous draft below. Preserve the same verified/provided business facts and evidence, but use a distinctly different messaging approach, subject, opening, CTA, and follow-up wording. Do not reuse sentences or a near-identical structure. The previous draft is for comparison only, not a source of facts.\n\nPrevious draft:\n${JSON.stringify(previousDraft)}`
      : "";
    const prompt = `Create a personalized outbound campaign for this prospect.\n\nProspect: ${JSON.stringify(prospect)}\nProduct: ${productDescription}\nTarget customer: ${targetCustomer}\n\nFirst call get_prospect_context using the prospect company. Then return JSON exactly in this shape:\n{"companySummary":"...","painPoint":"...","personalizationAngle":"...","whyThisMessage":["...","..."],"subject":"...","emailBody":"...","followups":[{"day":3,"subject":"...","body":"..."},{"day":7,"subject":"...","body":"..."}]}\nOnly use facts supplied by the prospect or tool. Do not add or infer company outcomes, team size, hiring, strategic motives, personal information, or facts based on general assumptions. Keep unsupported statements as product positioning, not prospect/company facts. whyThisMessage must be concise evidence summaries, not hidden reasoning.${alternativeInstruction}`;

    let result: Awaited<ReturnType<ReturnType<typeof createReachAIAgent>["invoke"]>> | undefined;
    let campaign;
    for (let attempt = 0; attempt < (previousDraft ? 2 : 1); attempt += 1) {
      result = await createReachAIAgent().invoke(
        attempt === 0
          ? prompt
          : `${prompt}\n\nThe prior alternative was not sufficiently distinct. Rewrite it with a more different subject, first paragraph, CTA, and both follow-ups while keeping the same verified facts.`,
      );
      const candidate = campaignGenerationResultSchema.parse(extractJson(result.toString()));
      if (!previousDraft || isMeaningfullyDifferent(previousDraft, candidate)) {
        campaign = candidate;
        break;
      }
    }

    if (!campaign || !result) {
      return NextResponse.json(
        { success: false, error: "We couldn't produce a sufficiently distinct alternative. Please regenerate again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
      toolUsed: (result.metrics?.toolUsage.get_prospect_context?.callCount ?? 0) > 0,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const details = error instanceof Error
        ? { name: error.name, message: error.message }
        : { name: "UnknownError", message: "Non-Error exception" };
      console.error("ReachAI campaign generation failed", details);
    }
    return NextResponse.json(
      { success: false, error: "We couldn't generate this outreach. Please confirm Bedrock access and try again." },
      { status: 500 },
    );
  }
}
