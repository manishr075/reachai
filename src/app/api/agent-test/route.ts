import { NextResponse } from "next/server";
import { z } from "zod";
import { createReachAIAgent } from "@/lib/reachai-agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = z.object({ message: z.string().trim().min(1).max(2000) }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Request body must include a non-empty 'message' string." },
        { status: 400 },
      );
    }

    const agent = createReachAIAgent();
    const result = await agent.invoke(parsed.data.message);

    return NextResponse.json({
      success: true,
      response: result.toString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "ReachAI is temporarily unavailable. Check Bedrock access and try again." },
      { status: 500 },
    );
  }
}
