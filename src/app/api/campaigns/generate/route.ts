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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = campaignGenerationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Provide a valid prospect, product description, and target customer." }, { status: 400 });
    }

    const { prospect, productDescription, targetCustomer } = parsed.data;
    const prompt = `Create a personalized outbound campaign for this prospect.\n\nProspect: ${JSON.stringify(prospect)}\nProduct: ${productDescription}\nTarget customer: ${targetCustomer}\n\nFirst call get_prospect_context using the prospect company. Then return JSON exactly in this shape:\n{"companySummary":"...","painPoint":"...","personalizationAngle":"...","whyThisMessage":["...","..."],"subject":"...","emailBody":"...","followups":[{"day":3,"subject":"...","body":"..."},{"day":7,"subject":"...","body":"..."}]}\nOnly use facts supplied by the prospect or tool. whyThisMessage must be concise evidence summaries, not hidden reasoning.`;
    const result = await createReachAIAgent().invoke(prompt);
    const campaign = campaignGenerationResultSchema.parse(extractJson(result.toString()));
    return NextResponse.json({ success: true, campaign });
  } catch {
    return NextResponse.json(
      { success: false, error: "We couldn't generate this outreach. Please confirm Bedrock access and try again." },
      { status: 500 },
    );
  }
}
