import { notFound } from "next/navigation";
import { getCampaign } from "@/lib/mock-data";
import { CampaignDetailView } from "@/components/campaign-detail-view";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  return <CampaignDetailView campaign={campaign} />;
}
