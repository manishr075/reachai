import { Agent, FunctionTool } from "@strands-agents/sdk";
import { BedrockModel } from "@strands-agents/sdk/models/bedrock";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { getProspectContext } from "@/lib/mock-data";

const systemPrompt = `You are ReachAI, an AI outbound sales assistant.
Your job is to analyze prospect information and create
concise, evidence-based personalized outreach.

Never invent facts.
Never claim unsupported personal information.
Focus on business relevance.
Do not use generic praise or fake personal details.
When asked to create a campaign, you MUST call get_prospect_context with the company name before drafting.
Return only valid JSON, with no markdown fences, matching the requested schema.`;

const getProspectContextTool = new FunctionTool({
  name: "get_prospect_context",
  description:
    "Looks up verified demo company information. Always use this before creating outreach for a prospect.",
  inputSchema: {
    type: "object",
    properties: { company: { type: "string", description: "Prospect company name" } },
    required: ["company"],
  },
  callback: (input: unknown) => {
    const company = typeof input === "object" && input && "company" in input
      ? String(input.company)
      : "";
    const context = getProspectContext(company);
    return context ?? { found: false, message: "No verified demo context found for this company." };
  },
});

export function createReachAIAgent() {
  const model = new BedrockModel({
    region: "ap-south-1",
    // Nova Micro in ap-south-1 must be invoked through the active APAC inference profile.
    modelId: "apac.amazon.nova-micro-v1:0",
    maxTokens: 1800,
    temperature: 0.35,
    clientConfig: { credentials: fromIni({ profile: "my-bedrock-profile" }) },
  });

  return new Agent({
    model,
    systemPrompt,
    tools: [getProspectContextTool],
    printer: false,
  });
}
