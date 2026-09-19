import { z } from "zod";

export const prospectStatusSchema = z.enum([
  "draft",
  "generated",
  "approved",
  "sent",
  "replied",
]);

export const prospectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  // An email is not needed to draft copy and is intentionally optional for demos.
  email: z.string().email().optional(),
  industry: z.string().min(1).optional(),
  companyDescription: z.string().min(1).optional(),
  recentSignal: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  status: prospectStatusSchema.optional(),
  companySummary: z.string().min(1).optional(),
  opportunity: z.string().min(1).optional(),
  personalizationAngle: z.string().min(1).optional(),
  emailSubject: z.string().min(1).optional(),
  emailBody: z.string().min(1).optional(),
  followUps: z.array(z.object({ day: z.number(), subject: z.string(), body: z.string() })).optional(),
  reasoning: z.string().min(1).optional(),
});

export const followUpSchema = z.object({
  day: z.union([z.literal(3), z.literal(7)]),
  subject: z.string().min(1).max(160),
  body: z.string().min(1).max(1200),
});

export const campaignGenerationResultSchema = z.object({
  companySummary: z.string().min(1).max(900),
  painPoint: z.string().min(1).max(500),
  personalizationAngle: z.string().min(1).max(500),
  whyThisMessage: z.array(z.string().min(1).max(300)).min(2).max(4),
  subject: z.string().min(1).max(160),
  emailBody: z.string().min(1).max(2200),
  followups: z.tuple([followUpSchema, followUpSchema]),
});

export const campaignSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  product: z.string().min(1),
  audience: z.string().min(1),
  status: z.enum(["active", "draft", "completed"]),
  createdAt: z.string().min(1),
  prospects: z.number().int().nonnegative(),
  generated: z.number().int().nonnegative(),
  approved: z.number().int().nonnegative(),
  replies: z.number().int().nonnegative(),
  prospectList: z.array(prospectSchema),
});

export const campaignGenerationRequestSchema = z.object({
  prospect: prospectSchema,
  productDescription: z.string().trim().min(10).max(3000),
  targetCustomer: z.string().trim().min(10).max(1500),
});

export type ProspectInput = z.infer<typeof prospectSchema>;
export type CampaignGenerationResult = z.infer<typeof campaignGenerationResultSchema>;
export type FollowUp = z.infer<typeof followUpSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
